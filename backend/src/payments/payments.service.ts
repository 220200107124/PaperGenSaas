import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import Razorpay from 'razorpay';
const paypal = require('@paypal/checkout-server-sdk');

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
      planName,
      type
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
        type,
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

  async createPaypalOrder(price: number, planName: string, userId: string, schoolId: string, type: string, frontendUrl: string) {
    const isTestMode = this.configService.get<string>('TEST_MODE') === 'true' || process.env.VITE_TEST_MODE === 'true';
    const clientId = this.configService.get<string>('PAYPAL_CLIENT_ID');
    const clientSecret = this.configService.get<string>('PAYPAL_CLIENT_SECRET');

    if (isTestMode || !clientId || !clientSecret) {
      return { 
        redirectUrl: `${frontendUrl}/pricing?status=success&planName=${encodeURIComponent(planName)}&type=${type}&token=TEST_MODE_BYPASS`, 
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
      purchase_units: [{ amount: { currency_code: 'USD', value: usdPrice }, description: `${planName} Subscription` }],
      application_context: {
        return_url: `${frontendUrl}/pricing?status=success&planName=${encodeURIComponent(planName)}&type=${type}`,
        cancel_url: `${frontendUrl}/pricing?status=cancelled`
      }
    });

    try {
      const order = await client.execute(request);
      const approveLink = order.result.links?.find((l: any) => l.rel === 'approve')?.href;
      if (!approveLink) throw new BadRequestException('Cannot generate PayPal redirect');
      return { redirectUrl: approveLink, orderId: order.result.id };
    } catch (e: any) {
      console.error("PayPal Execution Error Details:", e);
      // For fetch-like implementations, the SDK returns the raw response inside e
      const debugMsg = e.message || (e._originalError && e._originalError.message) || 'Unknown checkout error';
      throw new BadRequestException('PayPal API error: ' + debugMsg);
    }
  }

  async verifyPayPalPayment(paymentData: any) {
    const { paypalOrderId, userId, schoolId, planName, type } = paymentData;
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
      paypalOrderId,
      paypalCaptureId: finalCaptureId,
    });

    return { success: true, message: 'PayPal payment activated successfully' };
  }
}
