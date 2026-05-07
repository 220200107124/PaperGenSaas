import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import * as crypto from 'crypto';
import Razorpay from 'razorpay';
const paypal = require('@paypal/checkout-server-sdk');

@Injectable()
export class PaymentsService {
  private razorpay: any;

  constructor(
    private configService: ConfigService,
    private subscriptionsService: SubscriptionsService,
  ) {
    const key_id = (this.configService.get<string>('RAZORPAY_KEY_ID') || 'rzp_test_SfOyyf52Uj3eHK').trim();
    const key_secret = (this.configService.get<string>('RAZORPAY_KEY_SECRET') || '34ZsTIjp3HImEtzaxwVoqN6N').trim();
    
    if (key_id && key_secret) {
      this.razorpay = new Razorpay({
        key_id,
        key_secret,
      });
    } else {
      console.warn('[PaymentsService] Razorpay credentials missing. Payments will be disabled.');
    }
  }

  async createOrder(amount: number, userId?: string, schoolId?: string) {
    console.log('[PaymentsService] Creating Razorpay order for amount:', amount);
    
    if (!this.razorpay) {
      throw new BadRequestException('Razorpay is not configured on the server.');
    }

    const options = {
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: 'receipt_' + Date.now()
    };

    try {
      const order = await this.razorpay.orders.create(options);
      console.log('[PaymentsService] Order created:', order.id);
      return { 
        orderId: order.id,
        amount: order.amount,
        currency: order.currency
      };
    } catch (error: any) {
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
    console.log('[PaymentsService] Verifying order:', orderId, 'for userId:', userId);
    
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
    const body = orderId + '|' + paymentId;
    const expectedSignature = crypto.createHmac('sha256', keySecret).update(body.toString()).digest('hex');

    if (expectedSignature === signature) {
      console.log('[PaymentsService] Payment verified. Payment ID:', paymentId);
      
      await this.subscriptionsService.activateSubscription({
        userId,
        schoolId,
        type,
        planId,
        razorpayOrderId: orderId,
        razorpayPaymentId: paymentId,
        razorpaySignature: signature
      });

      return { status: 'COMPLETED', captureId: paymentId };
    } else {
      console.error('[PaymentsService] Invalid signature');
      throw new BadRequestException('Invalid signature');
    }
  }

  async verifyPayment(paymentData: any) {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, schoolId, planName, type } = paymentData;
    return this.captureOrder(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      paymentData.planId || planName,
      schoolId,
      type
    );
  }

  async createPaypalOrder(price: number, planName: string, planId: string | undefined, userId: string, schoolId: string, type: string, frontendUrl: string) {
    const isTestMode = this.configService.get<string>('TEST_MODE') === 'true' || process.env.VITE_TEST_MODE === 'true';
    const clientId = this.configService.get<string>('PAYPAL_CLIENT_ID');
    const clientSecret = this.configService.get<string>('PAYPAL_CLIENT_SECRET');

    if (isTestMode || !clientId || !clientSecret) {
      return { 
        redirectUrl: frontendUrl + '/pricing?status=success&planName=' + encodeURIComponent(planName) + '&planId=' + encodeURIComponent(planId || '') + '&type=' + type + '&token=TEST_MODE_BYPASS', 
        orderId: 'TEST_MODE_BYPASS' 
      };
    }

    const isSandbox = this.configService.get<string>('SANDBOX_URL')?.includes('sandbox') !== false;
    const environment = isSandbox ? new paypal.core.SandboxEnvironment(clientId, clientSecret) : new paypal.core.LiveEnvironment(clientId, clientSecret);
    const client = new paypal.core.PayPalHttpClient(environment);

    const usdPrice = (price / 83).toFixed(2);
    const request = new paypal.orders.OrdersCreateRequest();
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{ amount: { currency_code: 'USD', value: usdPrice }, description: planName + ' Subscription' }],
      application_context: {
        return_url: frontendUrl + '/pricing?status=success&planName=' + encodeURIComponent(planName) + '&planId=' + encodeURIComponent(planId || '') + '&type=' + type,
        cancel_url: frontendUrl + '/pricing?status=cancelled'
      }
    });

    try {
      const order = await client.execute(request);
      const approveLink = order.result.links?.find((l: any) => l.rel === 'approve')?.href;
      if (!approveLink) throw new BadRequestException('Cannot generate PayPal redirect');
      return { redirectUrl: approveLink, orderId: order.result.id };
    } catch (e: any) {
      console.error('PayPal Execution Error Details:', e);
      const debugMsg = e.message || (e._originalError && e._originalError.message) || 'Unknown checkout error';
      throw new BadRequestException('PayPal API error: ' + debugMsg);
    }
  }

  async verifyPayPalPayment(paymentData: any) {
    const { paypalOrderId, userId, schoolId, planName, planId, type } = paymentData;
    let finalCaptureId = paymentData.paypalCaptureId;

    if (paypalOrderId !== 'TEST_MODE_BYPASS') {
      const clientId = this.configService.get<string>('PAYPAL_CLIENT_ID');
      const clientSecret = this.configService.get<string>('PAYPAL_CLIENT_SECRET');
      
      if (clientId && clientSecret && !finalCaptureId) {
        const isSandbox = this.configService.get<string>('SANDBOX_URL')?.includes('sandbox') !== false;
        const environment = isSandbox ? new paypal.core.SandboxEnvironment(clientId, clientSecret) : new paypal.core.LiveEnvironment(clientId, clientSecret);
        const client = new paypal.core.PayPalHttpClient(environment);
        
        const request = new paypal.orders.OrdersCaptureRequest(paypalOrderId);
        request.requestBody({});
        try {
          const capture = await client.execute(request);
          if (capture.result.status !== 'COMPLETED') {
             throw new BadRequestException('PayPal payment capture failed or cancelled');
          }
          finalCaptureId = capture.result.id;
        } catch (e: any) {
          throw new BadRequestException('PayPal capture error: ' + (e.message || 'Unknown'));
        }
      }
    }

    await this.subscriptionsService.activateSubscription({
      userId,
      schoolId,
      type,
      planName,
      planId,
      paypalOrderId,
      paypalCaptureId: finalCaptureId,
    });

    return { success: true, message: 'PayPal payment activated successfully' };
  }
}
