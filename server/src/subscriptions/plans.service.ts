import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { Plan } from './entities/plans.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { createPaginationResponse } from '../common/utils/pagination.util';

@Injectable()
export class PlansService {
  constructor(
    @InjectRepository(Plan)
    private plansRepository: Repository<Plan>,
  ) {}

  async create(createData: DeepPartial<Plan>): Promise<Plan> {
    const plan = this.plansRepository.create(createData);
    return await this.plansRepository.save(plan);
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10, search, sortBy, order = 'ASC' } = paginationDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.plansRepository.createQueryBuilder('plan')
      .where('plan.isActive = :isActive', { isActive: true });

    if (search) {
      queryBuilder.andWhere('plan.name ILIKE :search', { search: `%${search}%` });
    }

    if (sortBy) {
      queryBuilder.orderBy(`plan.${sortBy}`, order as any);
    } else {
      queryBuilder.orderBy('plan.price', 'ASC');
    }

    const [data, totalRecords] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return createPaginationResponse(data, totalRecords, page, limit);
  }

  async findOne(id: string): Promise<Plan> {
    const plan = await this.plansRepository.findOne({ where: { id } });
    if (!plan) throw new NotFoundException('Plan not found');
    return plan;
  }

  async findByName(name: string): Promise<Plan | null> {
    return await this.plansRepository.findOne({ where: { name } });
  }

  async update(id: string, updateData: DeepPartial<Plan>): Promise<Plan> {
    await this.plansRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.plansRepository.delete(id);
  }
}
