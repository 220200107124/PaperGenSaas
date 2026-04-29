import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { Chapter } from './entities/chapters.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { createPaginationResponse } from '../common/utils/pagination.util';

@Injectable()
export class ChaptersService {
  constructor(
    @InjectRepository(Chapter)
    private chaptersRepository: Repository<Chapter>,
  ) {}

  async create(createData: DeepPartial<Chapter>): Promise<Chapter> {
    const chapter = this.chaptersRepository.create(createData);
    return await this.chaptersRepository.save(chapter);
  }

  async findAll(paginationDto: PaginationDto & { subjectId?: string }) {
    const { page = 1, limit = 10, search, sortBy, order = 'ASC', subjectId } = paginationDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.chaptersRepository.createQueryBuilder('chapter')
      .leftJoinAndSelect('chapter.subject', 'subject')
      .leftJoinAndSelect('subject.standard', 'standard');

    if (subjectId) {
      queryBuilder.andWhere('chapter.subjectId = :subjectId', { subjectId });
    }

    if (search) {
      queryBuilder.andWhere('chapter.name ILIKE :search', { search: `%${search}%` });
    }

    if (sortBy) {
      queryBuilder.orderBy(`chapter.${sortBy}`, order as any);
    } else {
      queryBuilder.orderBy('chapter.name', 'ASC');
    }

    const [data, totalRecords] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return createPaginationResponse(data, totalRecords, page, limit);
  }

  async findOne(id: string): Promise<Chapter | null> {
    return await this.chaptersRepository.findOne({ 
      where: { id },
      relations: ['subject', 'subject.standard']
    });
  }

  async update(id: string, updateData: any): Promise<Chapter | null> {
    await this.chaptersRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.chaptersRepository.delete(id);
  }

  async findBySubject(subjectId: string): Promise<Chapter[]> {
    return await this.chaptersRepository.find({ where: { subjectId } });
  }
}

