import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import * as crypto from 'crypto';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Razorpay = require('razorpay');

@Injectable()
export class PaymentsService {
  private razorpay;

  constructor(
    private configService: ConfigService,
    private subscriptionsService: SubscriptionsService,
  ) {
    const key_id = (this.configService.get<string>('RAZORPAY_KEY_ID') || 'rzp_test_SfOyyf52Uj3eHK').trim();
    const key_secret = (this.configService.get<string>('RAZORPAY_KEY_SECRET') || '34ZsTIjp3HImEtzaxwVoqN6N').trim();
    
    this.razorpay = new Razorpay({
      key_id,
      key_secret,
    });
  }

  async createOrder(amount: number) {
    console.log(`[PaymentsService] Creating Razorpay order for amount: ${amount} INR`);

    const options = {
      amount: Math.round(amount * 100), // amount in the smallest currency unit (paise), strictly integer
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    };

    try {
      const order = await this.razorpay.orders.create(options);
      console.log(`[PaymentsService] Order created: ${order.id}`);
      return { 
        orderId: order.id,
        amount: order.amount,
        currency: order.currency
      };
    } catch (error) {
      console.error('[PaymentsService] Razorpay order creation failed:', error);
      throw new BadRequestException('Razorpay order creation failed: ' + (error.message || 'Unknown error'));
    }
  }

  async captureOrder(
      orderId: string, 
      paymentId: string, 
      signature: string, 
      userId: string, 
      planId: string, 
      schoolId?: string, 
      type: 'teacher' | 'school' = 'teacher'
  ) {
    console.log(`[PaymentsService] Verifying order: ${orderId} for userId: ${userId}, planId: ${planId}`);
    
    // Handle FREE plan activation directly
    if (orderId && orderId.startsWith('FREE_PLAN_')) {
        console.log('[PaymentsService] Detected FREE plan activation bypass');
        await this.subscriptionsService.activateSubscription({
          userId,
          schoolId,
          type,
          planId,
          paypalOrderId: orderId,
          paypalCaptureId: 'FREE_' + Date.now(),
        });
        return { status: 'COMPLETED', captureId: 'FREE' };
    }

    const keySecret = (this.configService.get<string>('RAZORPAY_KEY_SECRET') || '34ZsTIjp3HImEtzaxwVoqN6N').trim();

    const body = orderId + "|" + paymentId;

    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === signature) {
      console.log(`[PaymentsService] Payment verified. Payment ID: ${paymentId}`);
      
      await this.subscriptionsService.activateSubscription({
        userId,
        schoolId,
        type,
        planId,
        paypalOrderId: orderId,
        paypalCaptureId: paymentId,
      });

      return { status: 'COMPLETED', captureId: paymentId };
    } else {
      console.error(`[PaymentsService] Invalid signature`);
      console.error(`Received orderId: ${orderId}, paymentId: ${paymentId}, signature: ${signature}`);
      console.error(`Expected: ${expectedSignature}, Body generated: ${body}`);
      throw new BadRequestException('Invalid signature');
    }
  }

  async verifyPayPalPayment(paymentData: any) {
    const { orderId, paymentId, signature, userId, schoolId, planId, type } = paymentData;
    return this.captureOrder(orderId, paymentId, signature, userId, planId, schoolId, type);
  }
}
