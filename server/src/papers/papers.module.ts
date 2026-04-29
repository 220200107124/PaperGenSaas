import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PapersController } from './papers.controller';
import { PapersService } from './papers.service';
import { Paper } from './entities/papers.entity';
import { PaperQuestion } from './entities/paper-questions.entity';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';

@Module({
  imports: [TypeOrmModule.forFeature([Paper, PaperQuestion]), SubscriptionsModule],
  controllers: [PapersController],
  providers: [PapersService],
  exports: [PapersService, TypeOrmModule],
})
export class PapersModule {}
