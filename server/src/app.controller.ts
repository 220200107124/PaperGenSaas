import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { UsersService } from './users/users.service';
import { SchoolRequestsService } from './school-requests/school-requests.service';
import { UserRole } from './users/entities/users.entity';
import { MailService } from './mail/mail.service';
import { AuthService } from './auth/auth.service';
import { successResponse, errorResponse } from './common/utils/response.util';
import { ConflictException } from '@nestjs/common';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly usersService: UsersService,
    private readonly schoolRequestsService: SchoolRequestsService,
    private readonly mailService: MailService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('school-register')
  async schoolRegister(@Body() dto: any) {
    const request = await this.schoolRequestsService.create(dto);
    return successResponse(request, 'School registration request submitted successfully');
  }

  @Post('teacher-register')
  async teacherRegister(@Body() dto: any) {
    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const user = await this.usersService.create({
      ...dto,
      role: UserRole.TEACHER,
      schoolId: null,
      status: 'ACTIVE',
      isEmailVerified: false,
    });

    try {
      await this.authService.sendVerificationEmail(user.email);
    } catch (e) {
      console.error(e);
    }

    return successResponse(user, 'Registration successful. Please verify your email.');
  }
}
