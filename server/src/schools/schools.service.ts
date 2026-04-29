import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSchoolDto } from './dto/create-schools.dto';
import { School } from './entities/schools.entity';
import { User, UserRole } from '../users/entities/users.entity';
import { Question, SourceType } from '../questions/entities/questions.entity';
import { Paper } from '../papers/entities/papers.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { createPaginationResponse } from '../common/utils/pagination.util';
import { MailService } from '../mail/mail.service';

@Injectable()
export class SchoolsService {
  constructor(
    @InjectRepository(School)
    private schoolsRepository: Repository<School>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Question)
    private questionsRepository: Repository<Question>,
    @InjectRepository(Paper)
    private papersRepository: Repository<Paper>,
    private mailService: MailService,
  ) {}

  async getDashboardStats(schoolId: string) {
    const [teachersCount, questionsCount, papersCount] = await Promise.all([
      this.usersRepository.count({ where: { schoolId, role: UserRole.TEACHER } }),
      this.questionsRepository.count({ where: { schoolId, sourceType: SourceType.SCHOOL } }),
      this.papersRepository.count({ where: { schoolId } }),
    ]);

    const recentTeachers = await this.usersRepository.find({
      where: { schoolId, role: UserRole.TEACHER },
      order: { createdAt: 'DESC' },
      take: 5,
    });

    return {
      stats: [
        { label: 'Teachers', value: teachersCount.toString(), color: 'text-brand-blue', bg: 'bg-brand-blue/10' },
        { label: 'School Questions', value: questionsCount.toLocaleString(), color: 'text-orange-600', bg: 'bg-orange-50' },
        { label: 'Papers Created', value: papersCount.toString(), color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Active Students', value: '0', color: 'text-purple-600', bg: 'bg-purple-50' }, // Placeholder for now
      ],
      recentTeachers: recentTeachers.map(t => ({
        name: t.name,
        email: t.email,
        status: t.status === 'ACTIVE' ? 'Active' : 'Inactive',
        joined: 'Recent'
      }))
    };
  }

  async create(createSchoolDto: CreateSchoolDto): Promise<School> {
    const newSchool = this.schoolsRepository.create(createSchoolDto);
    return await this.schoolsRepository.save(newSchool);
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10, search, sortBy, order = 'ASC' } = paginationDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.schoolsRepository.createQueryBuilder('school');

    if (search) {
      queryBuilder.andWhere('(school.name ILIKE :search OR school.city ILIKE :search)', {
        search: `%${search}%`,
      });
    }

    if (sortBy) {
      queryBuilder.orderBy(`school.${sortBy}`, order as any);
    } else {
      queryBuilder.orderBy('school.createdAt', 'DESC');
    }

    const [data, totalRecords] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return createPaginationResponse(data, totalRecords, page, limit);
  }

  async findOne(id: string): Promise<School | null> {
    return await this.schoolsRepository.findOne({ where: { id } });
  }

  async update(id: string, updateData: any): Promise<School | null> {
    await this.schoolsRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.schoolsRepository.delete(id);
  }

  async invite(email: string, name: string) {
    // In a real app, you might save this in an invitations table
    try {
      await this.mailService.sendSchoolInvite(email, name);
      return { success: true, message: 'Invitation sent' };
    } catch (error) {
      console.error('Failed to send school invite:', error);
      throw error;
    }
  }
}

