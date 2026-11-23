import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { School } from '../schools/entities/schools.entity';
import { User } from '../users/entities/users.entity';
import { Question, SourceType } from '../questions/entities/questions.entity';
import { Paper } from '../papers/entities/papers.entity';
import { Subscription } from '../subscriptions/entities/subscriptions.entity';

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
    @InjectRepository(Subscription)
    private subscriptionsRepository: Repository<Subscription>,
  ) {}

  async getPlatformStats() {
    const now = new Date();
    const [schoolsCount, usersCount, questionsCount, papersCount, activeSubscriptions, recentSchools] = await Promise.all([
      this.schoolsRepository.count(),
      this.usersRepository.count(),
      this.questionsRepository.count({ where: { sourceType: SourceType.GLOBAL } }),
      this.papersRepository.count(),
      this.subscriptionsRepository.createQueryBuilder('subscription')
        .where('subscription.status = :status', { status: 'ACTIVE' })
        .andWhere('(subscription.startDate IS NULL OR subscription.startDate <= :now)', { now })
        .andWhere('(subscription.endDate IS NULL OR subscription.endDate >= :now)', { now })
        .getCount(),
      this.schoolsRepository.find({ order: { createdAt: 'DESC' }, take: 5 }),
    ]);

    return {
      totalSchools: schoolsCount,
      totalUsers: usersCount,
      globalQuestions: questionsCount,
      totalPapersGenerated: papersCount,
      activeSubscriptions,
      recentSchools: await Promise.all(recentSchools.map(async (school) => {
        const subscription = await this.subscriptionsRepository.findOne({
          where: { schoolId: school.id, status: 'ACTIVE' },
          order: { createdAt: 'DESC' },
        });
        return {
          id: school.id,
          name: school.name,
          city: school.city || '',
          plan: subscription?.planName || 'No plan',
          status: school.isActive ? 'Active' : 'Inactive',
          createdAt: school.createdAt,
        };
      })),
    };
  }
}
