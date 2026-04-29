import { Controller, Get, Post, Body, UseGuards, Query, Param, Patch, Delete, NotFoundException } from '@nestjs/common';
import { ChaptersService } from './chapters.service';
import { CreateChapterDto } from './dto/create-chapters.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/users.entity';
import { PaginationDto } from '../common/dto/pagination.dto';

@Controller('chapters')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ChaptersController {
  constructor(private readonly chaptersService: ChaptersService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN)
  async create(@Body() createChapterDto: any) {
    const chapter = await this.chaptersService.create(createChapterDto);
    return {
      success: true,
      message: 'Chapter created successfully',
      data: chapter,
    };
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto & { subjectId?: string }) {
    return await this.chaptersService.findAll(paginationDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const chapter = await this.chaptersService.findOne(id);
    if (!chapter) throw new NotFoundException('Chapter not found');
    return {
      success: true,
      message: 'Chapter retrieved successfully',
      data: chapter,
    };
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN)
  async update(@Param('id') id: string, @Body() updateData: any) {
    const chapter = await this.chaptersService.update(id, updateData);
    return {
      success: true,
      message: 'Chapter updated successfully',
      data: chapter,
    };
  }

  @Patch(':id/status')
  @Roles(UserRole.SUPER_ADMIN)
  async updateStatus(@Param('id') id: string, @Body('status') status: boolean) {
    const chapter = await this.chaptersService.update(id, { status });
    return {
      success: true,
      message: 'Chapter status updated successfully',
      data: chapter,
    };
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  async remove(@Param('id') id: string) {
    await this.chaptersService.remove(id);
    return {
      success: true,
      message: 'Chapter deleted successfully',
    };
  }
}

