import { Controller, Get, Post, Body, UseGuards, ForbiddenException, Param, Patch, Query, Delete, NotFoundException, UseInterceptors, UploadedFile } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionsAIService } from './questions-ai.service';
import { CreateQuestionDto } from './dto/create-questions.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { TenantGuard } from '../common/guards/tenant.guard';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { GetUser } from '../common/decorators/get-user.decorator';
import { UserRole } from '../users/entities/users.entity';
import { SourceType } from './entities/questions.entity';
import { PaginationDto } from '../common/dto/pagination.dto';

import { RequirePermission } from '../common/decorators/permissions.decorator';
import { SubscriptionGuard } from '../common/guards/subscription.guard';

@Controller('questions')
@UseGuards(JwtAuthGuard, RolesGuard, TenantGuard, SubscriptionGuard)
@RequirePermission('questionModule')
export class QuestionsController {
  constructor(
    private readonly questionsService: QuestionsService,
    private readonly questionsAIService: QuestionsAIService,
  ) {}

  @Post('extract-pdf')
  @UseInterceptors(FileInterceptor('file'))
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.TEACHER)
  @RequirePermission('aiModule')
  async extractFromPDF(@UploadedFile() file: any) {
    if (!file) throw new NotFoundException('No file uploaded');
    const text = await this.questionsAIService.extractTextFromPDF(file.buffer);
    const questions = await this.questionsAIService.generateQuestionsFromText(text);
    return {
      success: true,
      message: 'Questions extracted successfully',
      data: questions,
    };
  }

  @Post('bulk')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.TEACHER)
  async bulkCreate(@Body('questions') questions: any[], @GetUser() user: any) {
    const finalQuestions = questions.map(q => {
      let qData = { ...q };
      if (user.role === UserRole.SUPER_ADMIN) {
        qData.sourceType = SourceType.GLOBAL;
        qData.schoolId = null;
      } else {
        qData.sourceType = SourceType.SCHOOL;
        qData.schoolId = user.schoolId;
      }
      qData.createdBy = user.id;
      qData.difficulty = qData.difficulty || 'MEDIUM';
      qData.questionType = qData.questionType || 'SHORT';
      qData.marks = qData.marks || 1;
      return qData;
    });

    const data = await this.questionsService.bulkCreate(finalQuestions);
    return {
      success: true,
      message: `${data.length} questions added successfully`,
      data,
    };
  }

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.TEACHER)
  async create(@Body() createQuestionDto: CreateQuestionDto, @GetUser() user: any) {
    let finalDto: any = { ...createQuestionDto };

    if (user.role === UserRole.SUPER_ADMIN) {
      finalDto.sourceType = SourceType.GLOBAL;
      finalDto.schoolId = null;
    } else {
      finalDto.sourceType = SourceType.SCHOOL;
      finalDto.schoolId = user.schoolId;
    }
    finalDto.createdBy = user.id;
    finalDto.difficulty = finalDto.difficulty || 'MEDIUM';
    finalDto.questionType = finalDto.questionType || 'SHORT';
    finalDto.marks = finalDto.marks || 1;

    const question = await this.questionsService.create(finalDto);
    return {
      message: 'Question created successfully',
      data: question,
    };
  }

  @Get()
  async findAll(@GetUser() user: any, @Query() paginationDto: PaginationDto) {
    return await this.questionsService.findAll(user, paginationDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const question = await this.questionsService.findOne(id);
    if (!question) throw new NotFoundException('Question not found');
    return {
      success: true,
      message: 'Question retrieved successfully',
      data: question,
    };
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN, UserRole.TEACHER)
  async update(@Param('id') id: string, @Body() updateData: any) {
    const question = await this.questionsService.update(id, updateData);
    return {
      success: true,
      message: 'Question updated successfully',
      data: question,
    };
  }

  @Patch(':id/status')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN)
  async updateStatus(@Param('id') id: string, @Body('status') status: boolean) {
    const question = await this.questionsService.update(id, { status });
    return {
      success: true,
      message: 'Question status updated successfully',
      data: question,
    };
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SCHOOL_ADMIN)
  async remove(@Param('id') id: string) {
    await this.questionsService.remove(id);
    return {
      success: true,
      message: 'Question deleted successfully',
    };
  }
}
