import { Controller, Get, Post, Body, UseGuards, Param, Patch, Query, Delete, NotFoundException } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { CreateSubjectDto } from './dto/create-subjects.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/users.entity';
import { PaginationDto } from '../common/dto/pagination.dto';

@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard, TenantGuard)
  @Roles(UserRole.SUPER_ADMIN)
  async create(@Body() createSubjectDto: any) {
    const subject = await this.subjectsService.create(createSubjectDto);
    return {
      success: true,
      message: 'Subject created successfully',
      data: subject,
    };
  }

  @Get('public')
  async findAllPublic(@Query() paginationDto: PaginationDto & { standardId?: string }) {
    return await this.subjectsService.findAllPublic(paginationDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard, TenantGuard)
  async findAll(@GetUser() user: any, @Query() paginationDto: PaginationDto & { standardId?: string }) {
    return await this.subjectsService.findAll(user, paginationDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard, TenantGuard)
  async findOne(@Param('id') id: string) {
    const subject = await this.subjectsService.findOne(id);
    if (!subject) throw new NotFoundException('Subject not found');
    return {
      success: true,
      message: 'Subject retrieved successfully',
      data: subject,
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard, TenantGuard)
  @Roles(UserRole.SUPER_ADMIN)
  async update(@Param('id') id: string, @Body() updateData: any) {
    const subject = await this.subjectsService.update(id, updateData);
    return {
      success: true,
      message: 'Subject updated successfully',
      data: subject,
    };
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard, TenantGuard)
  @Roles(UserRole.SUPER_ADMIN)
  async updateStatus(@Param('id') id: string, @Body('status') status: boolean) {
    const subject = await this.subjectsService.update(id, { status });
    return {
      success: true,
      message: 'Subject status updated successfully',
      data: subject,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard, TenantGuard)
  @Roles(UserRole.SUPER_ADMIN)
  async remove(@Param('id') id: string) {
    await this.subjectsService.remove(id);
    return {
      success: true,
      message: 'Subject deleted successfully',
    };
  }
}

