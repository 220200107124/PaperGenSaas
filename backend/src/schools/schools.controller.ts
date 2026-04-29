import { Controller, Get, Post, Body, UseGuards, Param, Patch, Query, Delete, NotFoundException, Req } from '@nestjs/common';
import { SchoolsService } from './schools.service';
import { CreateSchoolDto } from './dto/create-schools.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/users.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { successResponse } from '../common/utils/response.util';

@Controller('schools')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SchoolsController {
  constructor(private readonly schoolsService: SchoolsService) {}

  @Get('dashboard-stats')
  @Roles(UserRole.SCHOOL_ADMIN, UserRole.TEACHER)
  async getDashboardStats(@Req() req: any) {
    return await this.schoolsService.getDashboardStats(req.user.schoolId);
  }

  @Post()
  @Roles(UserRole.SUPER_ADMIN)
  async create(@Body() createSchoolDto: CreateSchoolDto) {
    const school = await this.schoolsService.create(createSchoolDto);
    return successResponse(school, 'School created successfully');
  }

  @Get()
  @Roles(UserRole.SUPER_ADMIN)
  async findAll(@Query() paginationDto: PaginationDto) {
    return await this.schoolsService.findAll(paginationDto);
  }

  @Get(':id')
  @Roles(UserRole.SUPER_ADMIN)
  async findOne(@Param('id') id: string) {
    const school = await this.schoolsService.findOne(id);
    if (!school) throw new NotFoundException('School not found');
    return successResponse(school, 'School retrieved successfully');
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN)
  async update(@Param('id') id: string, @Body() updateData: any) {
    const school = await this.schoolsService.update(id, updateData);
    return {
      success: true,
      message: 'School updated successfully',
      data: school,
    };
  }

  @Patch(':id/status')
  @Roles(UserRole.SUPER_ADMIN)
  async updateStatus(@Param('id') id: string, @Body('status') status: boolean) {
    const school = await this.schoolsService.update(id, { status });
    return {
      success: true,
      message: 'School status updated successfully',
      data: school,
    };
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  async remove(@Param('id') id: string) {
    await this.schoolsService.remove(id);
    return {
      success: true,
      message: 'School deleted successfully',
    };
  }

  @Post('invite')
  @Roles(UserRole.SUPER_ADMIN)
  async invite(@Body() inviteDto: { email: string; name: string }) {
    return await this.schoolsService.invite(inviteDto.email, inviteDto.name);
  }
}

