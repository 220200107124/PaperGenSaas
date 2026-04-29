import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { School } from '../schools/entities/schools.entity';
import { User } from '../users/entities/users.entity';
import { Question, SourceType } from '../questions/entities/questions.entity';
import { Paper } from '../papers/entities/papers.entity';

@Injectable()
export class SuperAdminService {
  constructor(
    @InjectRepository(School)
    private schoolsRepository: Repository<School>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Question)
    private questionsRepository: Repository<Question>,
    @InjectRepository(Paper)
    private papersRepository: Repository<Paper>,
  ) {}

  async getPlatformStats() {
    const [schoolsCount, usersCount, questionsCount, papersCount] = await Promise.all([
      this.schoolsRepository.count(),
      this.usersRepository.count(),
      this.questionsRepository.count({ where: { sourceType: SourceType.GLOBAL } }),
      this.papersRepository.count(),
    ]);

    // Mocking some revenue/subscription data for now
    return {
      totalSchools: schoolsCount,
      totalUsers: usersCount,
      globalQuestions: questionsCount,
      totalPapersGenerated: papersCount,
      activeSubscriptions: Math.floor(schoolsCount * 0.8), // 80% active
      revenue: schoolsCount * 499, // Assuming 499 per school
    };
  }
}
