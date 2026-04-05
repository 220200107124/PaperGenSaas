import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { CreateQuestionDto } from './dto/create-questions.dto';
import { Question } from './entities/questions.entity';
import { PaperQuestion } from '../papers/entities/paper-questions.entity';
import { UserRole } from '../users/entities/users.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { createPaginationResponse } from '../common/utils/pagination.util';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private questionsRepository: Repository<Question>,
    @InjectRepository(PaperQuestion)
    private paperQuestionRepository: Repository<PaperQuestion>,
  ) {}

  async create(createQuestionDto: DeepPartial<Question>): Promise<Question> {
    const newQuestion = this.questionsRepository.create(createQuestionDto);
    return await this.questionsRepository.save(newQuestion);
  }

  async findAll(user: any, paginationDto: PaginationDto & { standardId?: string; subjectId?: string; chapterId?: string; sourceType?: string }) {
    const { page = 1, limit = 10, search, sortBy, order = 'DESC', standardId, subjectId, chapterId, sourceType } = paginationDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.questionsRepository.createQueryBuilder('question')
      .leftJoinAndSelect('question.standard', 'standard')
      .leftJoinAndSelect('question.subject', 'subject')
      .leftJoinAndSelect('question.chapter', 'chapter');

    if (user.role !== UserRole.SUPER_ADMIN) {
      queryBuilder.where('(question.schoolId = :schoolId OR question.sourceType = :globalSource)', {
        schoolId: user.schoolId,
        globalSource: 'GLOBAL',
      });
    }

    if (sourceType) {
      queryBuilder.andWhere('question.sourceType = :sourceType', { sourceType });
    }

    if (standardId) {
      queryBuilder.andWhere('question.standardId = :standardId', { standardId });
    }

    if (subjectId) {
      queryBuilder.andWhere('question.subjectId = :subjectId', { subjectId });
    }

    if (chapterId) {
      queryBuilder.andWhere('question.chapterId = :chapterId', { chapterId });
    }

    if (search) {
      queryBuilder.andWhere('question.questionText ILIKE :search', { search: `%${search}%` });
    }

    if (sortBy) {
      queryBuilder.orderBy(`question.${sortBy}`, order as any);
    } else {
      queryBuilder.orderBy('question.createdAt', 'DESC');
    }

    const [data, totalRecords] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return createPaginationResponse(data, totalRecords, page, limit);
  }

  async findOne(id: string): Promise<Question | null> {
    return await this.questionsRepository.findOne({ 
      where: { id },
      relations: ['standard', 'subject', 'chapter']
    });
  }

  async update(id: string, updateData: any): Promise<Question | null> {
    await this.questionsRepository.update(id, updateData);
    return this.findOne(id);
  }

  async bulkCreate(questions: any[]): Promise<Question[]> {
    const newQuestions = this.questionsRepository.create(questions);
    return await this.questionsRepository.save(newQuestions);
  }

  async remove(id: string): Promise<void> {

    const usageCount = await this.paperQuestionRepository.count({ where: { questionId: id } });
    if (usageCount > 0) {
      throw new BadRequestException('This question is currently used in one or more papers and cannot be deleted.');
    }
    await this.questionsRepository.delete(id);
  }
}

