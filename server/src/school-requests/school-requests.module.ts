import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchoolRequestsService } from './school-requests.service';
import { SchoolRequestsController } from './school-requests.controller';
import { SchoolRequest } from './entities/school-request.entity';
import { UsersModule } from '../users/users.module';
import { SchoolsModule } from '../schools/schools.module';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SchoolRequest]),
    UsersModule,
    SchoolsModule,
    SubscriptionsModule,
  ],
  controllers: [SchoolRequestsController],
  providers: [SchoolRequestsService],
  exports: [SchoolRequestsService],
})
export class SchoolRequestsModule {}
