import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchoolsController } from './schools.controller';
import { SchoolsService } from './schools.service';
import { School } from './entities/schools.entity';
import { User } from '../users/entities/users.entity';
import { Question } from '../questions/entities/questions.entity';
import { Paper } from '../papers/entities/papers.entity';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [TypeOrmModule.forFeature([School, User, Question, Paper]), MailModule],
  controllers: [SchoolsController],
  providers: [SchoolsService],
  exports: [SchoolsService, TypeOrmModule],
})
export class SchoolsModule {}
