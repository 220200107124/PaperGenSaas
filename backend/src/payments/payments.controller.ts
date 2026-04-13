import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create-order')
  async createOrder(@Body() body: { amount: number; userId?: string; schoolId?: string }, @Req() req: any) {
    const userId = req.user.userId;
    const schoolId = req.user.schoolId;
    return this.paymentsService.createOrder(body.amount, userId, schoolId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('paypal/create-order')
  async createPaypalOrder(@Body() body: { price: number; planName: string; type: string }, @Req() req: any) {
    const userId = req.user.userId || req.user.id;
    const schoolId = req.user.schoolId;
    // We try to grab the origin or fallback to localhost
    const origin = req.headers.origin || 'http://localhost:5173';
    return this.paymentsService.createPaypalOrder(body.price, body.planName, userId, schoolId, body.type, origin);
  }

  @Post('verify')
  async verify(@Body() body: any) {
    return await this.paymentsService.verifyPayment(body);
  }

  @Post('paypal/verify')
  async verifyPayPal(@Body() body: any) {
    return await this.paymentsService.verifyPayPalPayment(body);
  }
}
