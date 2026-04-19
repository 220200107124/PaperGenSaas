import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create-order')
  async createOrder(@Body() body: { amount: number }) {
    return this.paymentsService.createOrder(body.amount);
  }

  @UseGuards(JwtAuthGuard)
  @Post('capture-order')
  async captureOrder(@Body() body: { orderId: string; userId: string; planId: string; schoolId?: string; type: 'teacher' | 'school' }) {
    return this.paymentsService.captureOrder(body.orderId, body.userId, body.planId, body.schoolId, body.type);
  }
}
