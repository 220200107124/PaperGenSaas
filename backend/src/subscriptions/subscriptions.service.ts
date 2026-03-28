import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { Subscription } from './entities/subscriptions.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { createPaginationResponse } from '../common/utils/pagination.util';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionsRepository: Repository<Subscription>,
  ) {}

  async create(createData: DeepPartial<Subscription>): Promise<Subscription> {
    const subscription = this.subscriptionsRepository.create(createData);
    return await this.subscriptionsRepository.save(subscription);
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10, search, sortBy, order = 'ASC' } = paginationDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.subscriptionsRepository.createQueryBuilder('subscription')
      .leftJoinAndSelect('subscription.school', 'school');

    if (search) {
      queryBuilder.andWhere('(subscription.planName ILIKE :search OR school.name ILIKE :search)', { search: `%${search}%` });
    }

    if (sortBy) {
      queryBuilder.orderBy(`subscription.${sortBy}`, order as any);
    } else {
      queryBuilder.orderBy('subscription.createdAt', 'DESC');
    }

    const [data, totalRecords] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return createPaginationResponse(data, totalRecords, page, limit);
  }

  async findOne(id: string): Promise<Subscription | null> {
    return await this.subscriptionsRepository.findOne({ where: { id } });
  }

  async findBySchool(schoolId: string): Promise<Subscription | null> {
    return await this.subscriptionsRepository.findOne({ where: { schoolId }, order: { createdAt: 'DESC' } });
  }

  async createDefaultSubscription(schoolId: string) {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1); // 1 month free trial

    return this.create({
      schoolId,
      planName: 'FREE_PLAN',
      paperLimit: 20,
      teacherLimit: 1,
      startDate,
      endDate,
      status: true,
      modulePermissions: {
        paperModule: true,
        teacherModule: true,
        questionModule: true,
      }
    });
  }

  async update(id: string, updateData: any): Promise<Subscription | null> {
    await this.subscriptionsRepository.update(id, updateData);
    return this.findOne(id);
  }

  async hasActiveSubscription(schoolId: string): Promise<boolean> {
    const subscription = await this.findBySchool(schoolId);
    if (!subscription) return false;
    
    const now = new Date();
    // Use getTime() for reliable comparison if needed, but Date objects work with comparison operators in TS/JS
    return subscription.status && 
           subscription.startDate <= now && 
           subscription.endDate >= now;
  }

  async remove(id: string): Promise<void> {
    await this.subscriptionsRepository.delete(id);
  }
}

