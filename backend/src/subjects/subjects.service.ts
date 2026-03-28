import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { Subject } from './entities/subjects.entity';
import { UserRole } from '../users/entities/users.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { createPaginationResponse } from '../common/utils/pagination.util';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectRepository(Subject)
    private subjectsRepository: Repository<Subject>,
  ) {}

  async create(createData: DeepPartial<Subject>): Promise<Subject> {
    const subject = this.subjectsRepository.create(createData);
    return await this.subjectsRepository.save(subject);
  }

  async findAll(user: any, paginationDto: PaginationDto & { standardId?: string }) {
    const { page = 1, limit = 10, search, sortBy, order = 'ASC', standardId } = paginationDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.subjectsRepository.createQueryBuilder('subject')
      .leftJoinAndSelect('subject.standard', 'standard');

    if (user.role !== UserRole.SUPER_ADMIN) {
      queryBuilder.where('(subject.schoolId = :schoolId OR subject.schoolId IS NULL)', {
        schoolId: user.schoolId,
      });
    }

    if (standardId) {
      queryBuilder.andWhere('subject.standardId = :standardId', { standardId });
    }

    if (search) {
      queryBuilder.andWhere('subject.name ILIKE :search', { search: `%${search}%` });
    }

    if (sortBy) {
      queryBuilder.orderBy(`subject.${sortBy}`, order as any);
    } else {
      queryBuilder.orderBy('standard.name', 'ASC').addOrderBy('subject.name', 'ASC');
    }

    const [data, totalRecords] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return createPaginationResponse(data, totalRecords, page, limit);
  }

  async findOne(id: string): Promise<Subject | null> {
    return await this.subjectsRepository.findOne({ where: { id }, relations: ['standard'] });
  }

  async update(id: string, updateData: any): Promise<Subject | null> {
    await this.subjectsRepository.update(id, updateData);
    return this.findOne(id);
  }


  async remove(id: string): Promise<void> {
    await this.subjectsRepository.delete(id);
  }
}

