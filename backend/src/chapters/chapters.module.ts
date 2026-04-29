import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChaptersController } from './chapters.controller';
import { ChaptersService } from './chapters.service';
import { Chapter } from './entities/chapters.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Chapter])],
  controllers: [ChaptersController],
  providers: [ChaptersService],
  exports: [ChaptersService, TypeOrmModule],
})
export class ChaptersModule {}
