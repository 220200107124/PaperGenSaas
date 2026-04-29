import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request, Query, Patch, NotFoundException } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/users.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { successResponse } from '../common/utils/response.util';

import { RequirePermission } from '../common/decorators/permissions.decorator';
import { SubscriptionGuard } from '../common/guards/subscription.guard';

@Controller('teachers')
@UseGuards(JwtAuthGuard, RolesGuard, SubscriptionGuard)
@Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.TEACHER)
@RequirePermission('teacherModule')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Post()
  @Roles(UserRole.SCHOOL_ADMIN)
  async create(@Body() createTeacherDto: any, @Request() req: any) {
    const teacher = await this.teachersService.create(createTeacherDto, req.user.schoolId);
    return successResponse(teacher, 'Teacher created successfully');
  }

  @Get()
  async findAll(@Request() req: any, @Query() paginationDto: PaginationDto) {
    return await this.teachersService.findAll(paginationDto, req.user.schoolId);
  }

  @Get('pending')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN)
  async findPending(@Query() paginationDto: PaginationDto) {
    return await this.teachersService.findPending(paginationDto);
  }

  @Post(':id/approve')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN)
  async approve(@Param('id') id: string) {
    return await this.teachersService.approve(id);
  }

  @Post(':id/reject')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN)
  async reject(@Param('id') id: string) {
    return await this.teachersService.reject(id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const teacher = await this.teachersService.findOne(id);
    if (!teacher) throw new NotFoundException('Teacher not found');
    return successResponse(teacher, 'Teacher retrieved successfully');
  }

  @Patch(':id')
  @Roles(UserRole.SCHOOL_ADMIN)
  async update(@Param('id') id: string, @Body() updateData: any) {
    const teacher = await this.teachersService.update(id, updateData);
    return {
      success: true,
      message: 'Teacher updated successfully',
      data: teacher,
    };
  }

  @Patch(':id/status')
  @Roles(UserRole.SCHOOL_ADMIN)
  async updateStatus(@Param('id') id: string, @Body('status') status: boolean) {
    const teacher = await this.teachersService.update(id, { status });
    return {
      success: true,
      message: 'Teacher status updated successfully',
      data: teacher,
    };
  }

  @Delete(':id')
  @Roles(UserRole.SCHOOL_ADMIN)
  async remove(@Param('id') id: string) {
    await this.teachersService.remove(id);
    return {
      success: true,
      message: 'Teacher deleted successfully',
    };
  }
}

