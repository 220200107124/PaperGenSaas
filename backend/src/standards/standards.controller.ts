import { Controller, Get, Post, Body, UseGuards, Param, Patch, Query, Delete, NotFoundException } from '@nestjs/common';
import { StandardsService } from './standards.service';
import { CreateStandardDto } from './dto/create-standards.dto';
import { TenantGuard } from '../common/guards/tenant.guard';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { GetUser } from '../common/decorators/get-user.decorator';
import { UserRole } from '../users/entities/users.entity';
import { PaginationDto } from '../common/dto/pagination.dto';

@Controller('standards')
export class StandardsController {
  constructor(private readonly standardsService: StandardsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard, TenantGuard)
  @Roles(UserRole.SUPER_ADMIN)
  async create(@Body() createStandardDto: CreateStandardDto) {
    const standard = await this.standardsService.create(createStandardDto);
    return {
      success: true,
      message: 'Standard created successfully',
      data: standard,
    };
  }

  @Get('public')
  async findAllPublic(@Query() paginationDto: PaginationDto) {
    return await this.standardsService.findAllPublic(paginationDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard, TenantGuard)
  async findAll(@GetUser() user: any, @Query() paginationDto: PaginationDto) {
    return await this.standardsService.findAll(user, paginationDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard, TenantGuard)
  async findOne(@Param('id') id: string) {
    const standard = await this.standardsService.findOne(id);
    if (!standard) throw new NotFoundException('Standard not found');
    return {
      success: true,
      message: 'Standard retrieved successfully',
      data: standard,
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard, TenantGuard)
  @Roles(UserRole.SUPER_ADMIN)
  async update(@Param('id') id: string, @Body() updateData: any) {
    const standard = await this.standardsService.update(id, updateData);
    return {
      success: true,
      message: 'Standard updated successfully',
      data: standard,
    };
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard, TenantGuard)
  @Roles(UserRole.SUPER_ADMIN)
  async updateStatus(@Param('id') id: string, @Body('status') status: boolean) {
    const standard = await this.standardsService.update(id, { status });
    return {
      success: true,
      message: 'Standard status updated successfully',
      data: standard,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard, TenantGuard)
  @Roles(UserRole.SUPER_ADMIN)
  async remove(@Param('id') id: string) {
    await this.standardsService.remove(id);
    return {
      success: true,
      message: 'Standard deleted successfully',
    };
  }
}

