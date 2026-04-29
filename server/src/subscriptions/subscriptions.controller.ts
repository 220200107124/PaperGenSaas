import { Controller, Get, Post, Body, UseGuards, Param, Patch, Query, Delete, NotFoundException } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/users.entity';
import { PaginationDto } from '../common/dto/pagination.dto';

@Controller('subscriptions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN)
  async create(@Body() createSubscriptionDto: any) {
    const subscription = await this.subscriptionsService.create(createSubscriptionDto);
    return {
      success: true,
      message: 'Subscription created successfully',
      data: subscription,
    };
  }

  @Get()
  @Roles(UserRole.SUPER_ADMIN)
  async findAll(@Query() paginationDto: PaginationDto) {
    return await this.subscriptionsService.findAll(paginationDto);
  }

  @Get(':id')
  @Roles(UserRole.SUPER_ADMIN)
  async findOne(@Param('id') id: string) {
    const subscription = await this.subscriptionsService.findOne(id);
    if (!subscription) throw new NotFoundException('Subscription not found');
    return {
      success: true,
      message: 'Subscription retrieved successfully',
      data: subscription,
    };
  }

  @Get('school/:schoolId')
  async findBySchool(@Param('schoolId') schoolId: string) {
    const subscription = await this.subscriptionsService.findBySchool(schoolId);
    return {
      success: true,
      message: 'School subscription retrieved successfully',
      data: subscription,
    };
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN)
  async update(@Param('id') id: string, @Body() updateData: any) {
    const subscription = await this.subscriptionsService.update(id, updateData);
    return {
      success: true,
      message: 'Subscription updated successfully',
      data: subscription,
    };
  }

  @Patch(':id/status')
  @Roles(UserRole.SUPER_ADMIN)
  async updateStatus(@Param('id') id: string, @Body('status') status: boolean) {
    const subscription = await this.subscriptionsService.update(id, { status });
    return {
      success: true,
      message: 'Subscription status updated successfully',
      data: subscription,
    };
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  async remove(@Param('id') id: string) {
    await this.subscriptionsService.remove(id);
    return {
      success: true,
      message: 'Subscription deleted successfully',
    };
  }
}

