import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SchoolRequest, SchoolRequestStatus } from './entities/school-request.entity';
import { UsersService } from '../users/users.service';
import { SchoolsService } from '../schools/schools.service';
import { UserRole } from '../users/entities/users.entity';
import { MailService } from '../mail/mail.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';

@Injectable()
export class SchoolRequestsService {
  constructor(
    @InjectRepository(SchoolRequest)
    private readonly schoolRequestRepository: Repository<SchoolRequest>,
    private readonly usersService: UsersService,
    private readonly schoolsService: SchoolsService,
    private readonly subscriptionsService: SubscriptionsService,
    private readonly mailService: MailService,
  ) {}

  async create(createDto: any) {
    // Check if user already exists
    const existingUser = await this.usersService.findByEmail(createDto.email);
    if (existingUser) {
      throw new BadRequestException(`Email ${createDto.email} is already associated with an existing account. Please login or use a different email.`);
    }

    const request = this.schoolRequestRepository.create({
      ...createDto,
      status: SchoolRequestStatus.PENDING,
    });
    return this.schoolRequestRepository.save(request);
  }

  async findAll(paginationDto: any) {
    const { page = 1, limit = 10, search, status } = paginationDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.schoolRequestRepository.createQueryBuilder('request');

    if (search) {
      queryBuilder.andWhere('(request.schoolName ILIKE :search OR request.email ILIKE :search)', { search: `%${search}%` });
    }

    if (status) {
      queryBuilder.andWhere('request.status = :status', { status });
    }

    queryBuilder.orderBy('request.createdAt', 'DESC');

    const [data, totalRecords] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    const totalPages = Math.ceil(totalRecords / limit);

    return {
      success: true,
      data,
      pagination: {
        totalRecords,
        totalPages,
        currentPage: page,
        limit,
      }
    };
  }

  findOne(id: string) {
    return this.schoolRequestRepository.findOne({ where: { id } });
  }

  async update(id: string, updateDto: any) {
    await this.schoolRequestRepository.update(id, updateDto);
    return this.findOne(id);
  }

  async approve(id: string) {
    const request = await this.findOne(id);
    if (!request) throw new NotFoundException('School request not found');
    if (request.status !== SchoolRequestStatus.PENDING) {
      throw new BadRequestException('Request is already processed');
    }

    // Check if user already exists
    const existingUser = await this.usersService.findByEmail(request.email);
    if (existingUser) {
      throw new BadRequestException(`Email ${request.email} is already associated with an existing account. Please use a different email or delete the existing account before approving.`);
    }

    // 1. Create School
    const school = await this.schoolsService.create({
      name: request.schoolName,
      email: request.email,
      phone: request.phone,
      city: request.city,
      isActive: true,
    } as any);

    // 2. Create SCHOOL_ADMIN user
    await this.usersService.create({
      name: request.schoolName + ' Admin',
      email: request.email,
      password: request.password,
      role: UserRole.SCHOOL_ADMIN,
      schoolId: school.id,
      isActive: true,
      status: 'ACTIVE',
      isEmailVerified: true,
    } as any);

    // 3. Assign default subscription plan
    await this.subscriptionsService.createDefaultSubscription(school.id);

    request.status = SchoolRequestStatus.APPROVED;
    const savedRequest = await this.schoolRequestRepository.save(request);

    // 4. Send Email
    try {
      await this.mailService.sendSchoolApproval(
        request.email,
        request.schoolName,
        request.schoolName + ' Admin',
        request.password || '123456',
      );
    } catch (error) {
      console.error('Failed to send approval email:', error);
    }

    return savedRequest;
  }

  async reject(id: string) {
    const request = await this.findOne(id);
    if (!request) throw new NotFoundException('School request not found');
    
    request.status = SchoolRequestStatus.REJECTED;
    return this.schoolRequestRepository.save(request);
  }

  remove(id: string) {
    return this.schoolRequestRepository.delete(id);
  }
}

