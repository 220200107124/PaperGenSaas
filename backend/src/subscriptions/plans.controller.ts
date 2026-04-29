import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { PlansService } from './plans.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/users.entity';
import { PaginationDto } from '../common/dto/pagination.dto';

@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  async create(@Body() createData: any) {
    return await this.plansService.create(createData);
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    return await this.plansService.findAll(paginationDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.plansService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  async update(@Param('id') id: string, @Body() updateData: any) {
    return await this.plansService.update(id, updateData);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  async remove(@Param('id') id: string) {
    return await this.plansService.remove(id);
  }
}
