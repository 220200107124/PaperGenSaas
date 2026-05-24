import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create-order')
  async createOrder(@Body() body: { amount: number; userId?: string; schoolId?: string }, @Req() req: any) {
    const userId = req.user?.userId || body.userId;
    const schoolId = req.user?.schoolId || body.schoolId;
    return this.paymentsService.createOrder(body.amount, userId, schoolId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('capture-order')
  async captureOrder(@Body() body: { 
      orderId: string; 
      paymentId: string;
      signature: string;
      userId: string; 
      planId: string; 
      schoolId?: string; 
      type: 'teacher' | 'school' 
  }) {
    return this.paymentsService.captureOrder(
        body.orderId, 
        body.paymentId, 
        body.signature, 
        body.userId, 
        body.planId, 
        body.schoolId, 
        body.type
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('paypal/create-order')
  async createPaypalOrder(@Body() body: { price: number; planName: string; planId?: string; type: string }, @Req() req: any) {
    const userId = req.user?.userId || req.user?.id;
    const schoolId = req.user?.schoolId;
    const origin = req.headers.origin || 'http://localhost:5173';
    return this.paymentsService.createPaypalOrder(body.price, body.planName, body.planId, userId, schoolId, body.type, origin);
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
