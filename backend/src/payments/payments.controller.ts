import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create-order')
  async createOrder(@Body() body: { amount: number; userId?: string; schoolId?: string }, @Req() req: any) {
    // Current user can be extracted from req.user
    const userId = req.user.userId;
    const schoolId = req.user.schoolId;
    return this.paymentsService.createOrder(body.amount, userId, schoolId);
  }

  @Post('verify')
  async verifyPayment(@Body() paymentData: any) {
    return this.paymentsService.verifyPayment(paymentData);
  }
}
