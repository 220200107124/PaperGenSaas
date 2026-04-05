import { Injectable, ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';

import { UsersService } from '../users/users.service';
import { UserRole } from '../users/entities/users.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { MailService } from '../mail/mail.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';

@Injectable()
export class TeachersService {
  constructor(
    private readonly usersService: UsersService,
    private readonly subscriptionsService: SubscriptionsService,
    private readonly mailService: MailService,
  ) {}

  async create(createTeacherDto: any, schoolId: string) {
    if (schoolId) {
      const subscription = await this.subscriptionsService.findBySchool(schoolId);
      if (!subscription || !subscription.status) {
        throw new ForbiddenException('Valid subscription required to add teachers.');
      }

      // Check teacher limit
      const teacherCount = await this.usersService.findAll({
        role: UserRole.TEACHER,
        schoolId,
        limit: 1,
        page: 1,
      });

      if (subscription.teacherLimit !== -1 && teacherCount.pagination.totalRecords >= subscription.teacherLimit) {
        throw new ForbiddenException('Teacher limit reached for your current plan.');
      }

      // Check if subject is already assigned in this school
      const existingTeacher = await this.usersService.findAll({
        schoolId,
        subjectId: createTeacherDto.subjectId,
        limit: 1,
        page: 1,
      });

      if (existingTeacher.pagination.totalRecords > 0) {
        throw new BadRequestException('This subject is already assigned to another teacher in your school.');
      }
    }


    const tempPassword = Math.random().toString(36).slice(-8);

    const teacher = await this.usersService.create({
      ...createTeacherDto,
      role: UserRole.TEACHER,
      schoolId,
      password: tempPassword,
    } as any);

    try {
      await this.mailService.sendMail(
        teacher.email,
        'Teacher Invitation',
        `<h1>Hello ${teacher.name},</h1>
         <p>You have been invited as a teacher.</p>
         <p><b>Login URL:</b> http://localhost:5173/login</p>
         <p><b>Email:</b> ${teacher.email}</p>
         <p><b>Temporary Password:</b> ${tempPassword}</p>
         <br>
         <p>Teacher must change password after login.</p>
         <p>Best Regards,<br> paperGeneration Team</p>`
      );
    } catch (error) {
      console.error('Failed to send teacher invitation email:', error);
    }

    return teacher;
  }

  async findAll(paginationDto: PaginationDto, schoolId: string) {
    return this.usersService.findAll({
      ...paginationDto,
      role: UserRole.TEACHER,
      schoolId,
    });
  }

  async findPending(paginationDto: PaginationDto) {
    return this.usersService.findAll({
      ...paginationDto,
      role: UserRole.TEACHER,
      status: 'PENDING',
    } as any);
  }

  async approve(id: string) {
    const teacher = await this.findOne(id);
    if (!teacher) throw new NotFoundException('Teacher not found');
    
    const tempPassword = Math.random().toString(36).slice(-8);

    await this.update(id, {
      status: 'APPROVED',
      password: tempPassword,
      mustChangePassword: true,
    });

    try {
      await this.mailService.sendMail(
        teacher.email,
        'Teacher Account Approved',
        `<h1>Hello ${teacher.name},</h1>
         <p>Your teacher account has been approved.</p>
         <p><b>Login URL:</b> http://localhost:5173/login</p>
         <p><b>Email:</b> ${teacher.email}</p>
         <p><b>Temporary Password:</b> ${tempPassword}</p>
         <br>
         <p>You must change your password after login.</p>
         <p>Best Regards,<br> paperGeneration Team</p>`
      );
    } catch (error) {
      console.error('Failed to send teacher approval email:', error);
    }

    return { success: true, message: 'Teacher approved successfully' };
  }

  async reject(id: string) {
    await this.update(id, { status: 'REJECTED' });
    return { success: true, message: 'Teacher rejected successfully' };
  }

  findOne(id: string) {
    return this.usersService.findById(id);
  }

  update(id: string, updateData: any) {
    return this.usersService.update(id, updateData);
  }

  remove(id: string) {
    return this.usersService.remove(id);
  }
}

