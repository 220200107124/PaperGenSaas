import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import Razorpay from 'razorpay';

@Injectable()
export class PaymentsService {
  private razorpay: any;

  constructor(
    private configService: ConfigService,
    private subscriptionsService: SubscriptionsService,
  ) {
    const keyId = this.configService.get<string>('RAZORPAY_KEY_ID');
    const keySecret = this.configService.get<string>('RAZORPAY_KEY_SECRET');

    if (keyId && keySecret) {
      this.razorpay = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      });
    } else {
      console.warn('[PaymentsService] Razorpay credentials missing. Payments will be disabled.');
    }
  }

  async createOrder(amount: number, userId?: string, schoolId?: string) {
    if (!this.razorpay) {
      throw new BadRequestException('Razorpay is not configured on the server. Please contact support.');
    }

    const options = {
      amount: amount * 100, // Razorpay works in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    try {
      const order = await this.razorpay.orders.create(options);
      
      // Store pending subscription/order info if needed or return order
      return order;
    } catch (error) {
      console.error('Razorpay order creation failed:', error);
      throw new BadRequestException('Payment order creation failed');
    }
  }

  async verifyPayment(paymentData: any) {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      userId,
      schoolId,
      planName
    } = paymentData;

    const key_secret = this.configService.get<string>('RAZORPAY_KEY_SECRET');
    
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', key_secret!)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      // Signature verified, activate subscription
      await this.subscriptionsService.activateSubscription({
        userId,
        schoolId,
        planName,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
      });

      return { success: true, message: 'Payment verified successfully' };
    } else {
      throw new BadRequestException('Invalid signature');
    }
  }
}
