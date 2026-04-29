import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SuperAdminController } from './super-admin.controller';
import { SuperAdminService } from './super-admin.service';
import { School } from '../schools/entities/schools.entity';
import { User } from '../users/entities/users.entity';
import { Question } from '../questions/entities/questions.entity';
import { Paper } from '../papers/entities/papers.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([School, User, Question, Paper]),
  ],
  controllers: [SuperAdminController],
  providers: [SuperAdminService],
  exports: [SuperAdminService],
})
export class SuperAdminModule {}
