import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { Standard } from './entities/standards.entity';
import { UserRole } from '../users/entities/users.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { createPaginationResponse } from '../common/utils/pagination.util';

@Injectable()
export class StandardsService {
  constructor(
    @InjectRepository(Standard)
    private standardsRepository: Repository<Standard>,
  ) {}

  async create(createData: DeepPartial<Standard>): Promise<Standard> {
    const standard = this.standardsRepository.create(createData);
    return await this.standardsRepository.save(standard);
  }

  async findAll(user: any, paginationDto: PaginationDto) {
    const { page = 1, limit = 10, search, sortBy, order = 'ASC' } = paginationDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.standardsRepository.createQueryBuilder('standard');

    if (user && user.role !== UserRole.SUPER_ADMIN) {
      queryBuilder.where('(standard.schoolId = :schoolId OR standard.schoolId IS NULL)', {
        schoolId: user.schoolId,
      });
    } else if (!user) {
      queryBuilder.where('standard.schoolId IS NULL');
    }

    if (search) {
      queryBuilder.andWhere('standard.name ILIKE :search', { search: `%${search}%` });
    }

    if (sortBy) {
      queryBuilder.orderBy(`standard.${sortBy}`, order as any);
    } else {
      queryBuilder.orderBy('standard.name', 'ASC');
    }

    const [data, totalRecords] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return createPaginationResponse(data, totalRecords, page, limit);
  }

  async findAllPublic(paginationDto: PaginationDto) {
     return this.findAll(null, paginationDto);
  }

  async findOne(id: string): Promise<Standard | null> {
    return await this.standardsRepository.findOne({ where: { id } });
  }

  async update(id: string, updateData: any): Promise<Standard | null> {
    await this.standardsRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.standardsRepository.delete(id);
  }
}

