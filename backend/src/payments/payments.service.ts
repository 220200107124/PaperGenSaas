import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
const paypal = require('@paypal/checkout-server-sdk');

@Injectable()
export class PaymentsService {
  constructor(
    private configService: ConfigService,
    private subscriptionsService: SubscriptionsService,
  ) {}

  async createOrder(amount: number) {
    console.log(`[PaymentsService] Creating PayPal order for amount: ${amount} USD`);
    const clientId = this.configService.get<string>('PAYPAL_CLIENT_ID');
    const clientSecret = this.configService.get<string>('PAYPAL_CLIENT_SECRET');

    if (!clientId || !clientSecret) {
      console.error('[PaymentsService] Missing PayPal credentials');
      throw new BadRequestException('PayPal is not configured on the server.');
    }

    const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
    const client = new paypal.core.PayPalHttpClient(environment);

    const request = new paypal.orders.OrdersCreateRequest();
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: amount.toString(),
        },
      }],
    });

    try {
      const order = await client.execute(request);
      console.log(`[PaymentsService] Order created: ${order.result.id}`);
      return { orderId: order.result.id };
    } catch (error) {
      console.error('[PaymentsService] PayPal order creation failed:', error.message || error);
      throw new BadRequestException('PayPal order creation failed: ' + (error.message || 'Unknown error'));
    }
  }

  async captureOrder(orderId: string, userId: string, planId: string, schoolId?: string, type: 'teacher' | 'school' = 'teacher') {
    console.log(`[PaymentsService] Capturing order: ${orderId} for userId: ${userId}, planId: ${planId}`);
    
    // Handle FREE plan activation directly without PayPal call
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

    const clientId = this.configService.get<string>('PAYPAL_CLIENT_ID');
    const clientSecret = this.configService.get<string>('PAYPAL_CLIENT_SECRET');

    if (!clientId || !clientSecret) {
      throw new BadRequestException('PayPal is not configured on the server.');
    }

    const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
    const client = new paypal.core.PayPalHttpClient(environment);

    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});

    try {
      const capture = await client.execute(request);
      console.log(`[PaymentsService] Capture status: ${capture.result.status}`);

      if (capture.result.status === 'COMPLETED') {
        const captureId = capture.result.purchase_units[0].payments.captures[0].id;
        console.log(`[PaymentsService] Payment captured. ID: ${captureId}`);
        
        await this.subscriptionsService.activateSubscription({
          userId,
          schoolId,
          type,
          planId,
          paypalOrderId: orderId,
          paypalCaptureId: captureId,
        });

        return { status: 'COMPLETED', captureId };
      } else {
        console.warn(`[PaymentsService] Capture not completed: ${capture.result.status}`);
        throw new BadRequestException('PayPal payment not completed');
      }
    } catch (error) {
      console.error('[PaymentsService] PayPal capture failed:', error.message || error);
      throw new BadRequestException('PayPal capture failed: ' + (error.message || 'Unknown error'));
    }
  }

  async verifyPayPalPayment(paymentData: any) {
    const { paypalOrderId, userId, schoolId, planId, type } = paymentData;
    return this.captureOrder(paypalOrderId, userId, planId, schoolId, type);
  }
}
