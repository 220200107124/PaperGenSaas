import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StandardsController } from './standards.controller';
import { StandardsService } from './standards.service';
import { Standard } from './entities/standards.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Standard])],
  controllers: [StandardsController],
  providers: [StandardsService],
  exports: [StandardsService, TypeOrmModule],
})
export class StandardsModule {}
