import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionsController } from './questions.controller';
import { QuestionsService } from './questions.service';
import { Question } from './entities/questions.entity';
import { PaperQuestion } from '../papers/entities/paper-questions.entity';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { QuestionsAIService } from './questions-ai.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Question, PaperQuestion]), SubscriptionsModule],
  controllers: [QuestionsController],
  providers: [QuestionsService, QuestionsAIService],
  exports: [QuestionsService, TypeOrmModule],
})
export class QuestionsModule {}

