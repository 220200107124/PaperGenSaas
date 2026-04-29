import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';
import { Subscription } from './entities/subscriptions.entity';
import { Plan } from './entities/plans.entity';
import { PlansController } from './plans.controller';
import { PlansService } from './plans.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Subscription, Plan])],
  controllers: [SubscriptionsController, PlansController],
  providers: [SubscriptionsService, PlansService],
  exports: [SubscriptionsService, PlansService, TypeOrmModule],
})
export class SubscriptionsModule {}

