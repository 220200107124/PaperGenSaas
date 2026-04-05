import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { Subscription } from './entities/subscriptions.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { createPaginationResponse } from '../common/utils/pagination.util';
import { PlansService } from './plans.service';


@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionsRepository: Repository<Subscription>,
    private plansService: PlansService,
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

    // Try to find a FREE_PLAN in dynamic plans first
    const freePlan = await this.plansService.findByName('FREE_PLAN');

    return this.create({
      schoolId,
      planName: freePlan ? freePlan.name : 'FREE_PLAN',
      paperLimit: freePlan ? freePlan.paperLimit : 20,
      teacherLimit: freePlan ? freePlan.teacherLimit : 1,
      startDate,
      endDate,
      status: true,
      modulePermissions: freePlan ? freePlan.modulePermissions : {
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

  async findByUser(userId: string): Promise<Subscription | null> {
    return await this.subscriptionsRepository.findOne({ where: { userId }, order: { createdAt: 'DESC' } });
  }

  async activateSubscription(data: { 
    userId?: string; 
    schoolId?: string; 
    planName: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }) {
    const { userId, schoolId, planName, razorpayOrderId, razorpayPaymentId, razorpaySignature } = data;

    // Fetch plan details from DB
    const plan = await this.plansService.findByName(planName);
    if (!plan) {
      throw new Error(`Plan ${planName} not found in system.`);
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + 1); // 1 year subscription

    const subscription = this.subscriptionsRepository.create({
      userId,
      schoolId,
      planName: plan.name,
      paperLimit: plan.paperLimit,
      teacherLimit: plan.teacherLimit,
      startDate,
      endDate,
      status: true,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      modulePermissions: plan.modulePermissions
    });

    return await this.subscriptionsRepository.save(subscription);
  }


  async hasActiveSubscription(id: { schoolId?: string, userId?: string }): Promise<boolean> {
    let subscription: Subscription | null = null;
    if (id.schoolId) {
      subscription = await this.findBySchool(id.schoolId);
    } else if (id.userId) {
      subscription = await this.findByUser(id.userId);
    }

    if (!subscription) return false;
    
    const now = new Date();
    return subscription.status && 
           (!subscription.startDate || subscription.startDate <= now) && 
           (!subscription.endDate || subscription.endDate >= now);
  }

  async remove(id: string): Promise<void> {
    await this.subscriptionsRepository.delete(id);
  }
}


