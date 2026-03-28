import { Controller, Get, Post, Body, UseGuards, Param, Delete, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { PapersService } from './papers.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { TenantGuard } from '../common/guards/tenant.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { GetUser } from '../common/decorators/get-user.decorator';
import { UserRole } from '../users/entities/users.entity';

import { RequirePermission } from '../common/decorators/permissions.decorator';
import { SubscriptionGuard } from '../common/guards/subscription.guard';

@Controller('papers')
@UseGuards(JwtAuthGuard, RolesGuard, TenantGuard, SubscriptionGuard)
@RequirePermission('paperModule')
export class PapersController {
  constructor(private readonly papersService: PapersService) {}

  @Post('create')
  @Roles(UserRole.SCHOOL_ADMIN, UserRole.TEACHER)
  async create(@Body() createPaperDto: any, @GetUser() user: any) {
    const paper = await this.papersService.create(createPaperDto, user);
    return {
      message: 'Paper created successfully',
      data: paper,
    };
  }

  @Post('save-draft')
  @Roles(UserRole.SCHOOL_ADMIN, UserRole.TEACHER)
  async saveDraft(@Body() createPaperDto: any, @GetUser() user: any) {
    const paper = await this.papersService.saveDraft(createPaperDto, user);
    return {
      message: 'Paper saved as draft',
      data: paper,
    };
  }

  @Post('publish/:id')
  @Roles(UserRole.SCHOOL_ADMIN, UserRole.TEACHER)
  async publish(@Param('id') id: string, @GetUser() user: any) {
    const paper = await this.papersService.publish(id, user);
    return {
      message: 'Paper published successfully',
      data: paper,
    };
  }

  @Get()
  @Roles(UserRole.SCHOOL_ADMIN, UserRole.TEACHER, UserRole.SUPER_ADMIN)
  async findAll(@GetUser() user: any, @Query() paginationDto: any) {
    return this.papersService.findAll(user, paginationDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const paper = await this.papersService.findOne(id);
    return {
      message: 'Paper details retrieved successfully',
      data: paper,
    };
  }

  @Get(':id/download')
  async download(@Param('id') id: string, @Res() res: any) {
    const doc = await this.papersService.download(id);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=paper-${id}.pdf`);
    doc.pipe(res);
    doc.end();
  }

  @Delete(':id')
  @Roles(UserRole.SCHOOL_ADMIN, UserRole.SUPER_ADMIN)
  async remove(@Param('id') id: string) {
    await this.papersService.remove(id);
    return {
      message: 'Paper deleted successfully',
    };
  }
}
