import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { successResponse } from '../common/utils/response.util';
import { SchoolRequestsService } from './school-requests.service';
import { CreateSchoolRequestDto } from './dto/create-school-request.dto';
import { UpdateSchoolRequestDto } from './dto/update-school-request.dto';

@Controller('school-requests')
export class SchoolRequestsController {
  constructor(private readonly schoolRequestsService: SchoolRequestsService) {}

  @Post()
  async create(@Body() createSchoolRequestDto: CreateSchoolRequestDto) {
    const data = await this.schoolRequestsService.create(createSchoolRequestDto);
    return successResponse(data, 'School registration request submitted successfully');
  }

  @Get()
  findAll(@Query() paginationDto: any) {
    return this.schoolRequestsService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.schoolRequestsService.findOne(id);
  }

  @Post(':id/approve')
  async approve(@Param('id') id: string) {
    const data = await this.schoolRequestsService.approve(id);
    return successResponse(data, 'School request approved successfully');
  }

  @Post(':id/reject')
  reject(@Param('id') id: string) {
    return this.schoolRequestsService.reject(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSchoolRequestDto: UpdateSchoolRequestDto) {
    return this.schoolRequestsService.update(id, updateSchoolRequestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.schoolRequestsService.remove(id);
  }
}
