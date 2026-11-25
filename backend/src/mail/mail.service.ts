import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private configService: ConfigService) {
    const mode = this.getEmailMode();
    this.logger.log(`MailService initialized with provider mode: [${mode.toUpperCase()}]`);
  }

  private getEmailMode(): 'smtp' | 'resend' {
    const mode = (this.configService.get<string>('EMAIL_MODE') || 'smtp').toLowerCase().trim();
    return mode === 'resend' ? 'resend' : 'smtp';
  }

  private getSmtpTransporter(): nodemailer.Transporter {
    const user =
      this.configService.get<string>('SMTP_USER') ||
      this.configService.get<string>('MAIL_USER') ||
      'bg.official09327@gmail.com';
    const pass =
      this.configService.get<string>('APP_PASSWORD') ||
      this.configService.get<string>('SMTP_PASS') ||
      this.configService.get<string>('MAIL_PASS') ||
      '';
    const host =
      this.configService.get<string>('SMTP_HOST') ||
      this.configService.get<string>('MAIL_HOST') ||
      'smtp.gmail.com';
    const port = Number(
      this.configService.get<number>('SMTP_PORT') ||
      this.configService.get<number>('MAIL_PORT') ||
      465,
    );
    const secure =
      this.configService.get<string>('SMTP_SECURE') === 'true' ||
      port === 465;

    if (!pass) {
      throw new Error(
        `APP_PASSWORD is not set in .env. Please add your 16-character Google App Password in .env to send emails via Gmail SMTP (${user}).`,
      );
    }

    if (host === 'smtp.gmail.com' || host === 'gmail' || user.endsWith('@gmail.com')) {
      return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user,
          pass,
        },
      });
    }

    return nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    });
  }

  private getResendClient(): { client: Resend; from: string } {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    if (!apiKey) {
      throw new Error(
        'RESEND_API_KEY is not set in .env. Please provide your Resend API Key to send emails via Resend.',
      );
    }

    const from =
      this.configService.get<string>('RESEND_EMAIL') ||
      this.configService.get<string>('MAIL_FROM') ||
      'onboarding@resend.dev';

    return {
      client: new Resend(apiKey),
      from,
    };
  }

  async sendMail(to: string, subject: string, html: string) {
    if (this.configService.get<string>('DISABLE_EMAILS') === 'true') {
      this.logger.log(`DISABLE_EMAILS is true. Skipping email to: ${to} (Subject: "${subject}")`);
      return { success: true, mocked: true };
    }

    const mode = this.getEmailMode();

    if (mode === 'resend') {
      try {
        const { client, from } = this.getResendClient();
        this.logger.log(`[Resend] Sending email to "${to}" (Subject: "${subject}", From: "${from}")...`);

        const { data, error } = await client.emails.send({
          from,
          to: [to],
          subject,
          html,
        });

        if (error) {
          this.logger.error(`[Resend] Failed to send email: ${error.message}`);
          throw new Error(`Resend API error: ${error.message}`);
        }

        this.logger.log(`[Resend] Email sent successfully! ID: ${data?.id}`);
        return data;
      } catch (error) {
        this.logger.error(`[Resend] Error sending email to ${to}:`, error);
        throw error;
      }
    } else {
      // SMTP / Nodemailer
      try {
        const user =
          this.configService.get<string>('SMTP_USER') ||
          this.configService.get<string>('MAIL_USER') ||
          'bg.official09327@gmail.com';
        const from =
          this.configService.get<string>('MAIL_FROM') ||
          this.configService.get<string>('SMTP_FROM') ||
          `"PaperGen SaaS" <${user}>`;

        const transporter = this.getSmtpTransporter();
        this.logger.log(`[SMTP] Sending email to "${to}" (Subject: "${subject}", From: "${from}")...`);

        const info = await transporter.sendMail({
          from,
          to,
          subject,
          html,
        });

        this.logger.log(`[SMTP] Email sent successfully! MessageId: ${info.messageId}`);
        return info;
      } catch (error) {
        this.logger.error(`[SMTP] Error sending email to ${to}:`, error);
        throw error;
      }
    }
  }

  async sendTeacherRegistration(email: string, name: string, password: string) {
    const subject = 'Welcome to PaperGen SaaS - Teacher Registration';
    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';
    const loginUrl = `${frontendUrl}/login`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff;">
        <h2 style="color: #1e293b; margin-top: 0;">Welcome, ${name}!</h2>
        <p style="color: #475569; font-size: 15px; line-height: 1.6;">
          Thank you for registering as a teacher on <b>PaperGen SaaS</b>. Your account is ready.
        </p>
        <div style="background-color: #f8fafc; border-left: 4px solid #4f46e5; padding: 16px; margin: 20px 0; border-radius: 4px;">
          <p style="margin: 4px 0; color: #334155;"><strong>Login URL:</strong> <a href="${loginUrl}" style="color: #4f46e5;">${loginUrl}</a></p>
          <p style="margin: 4px 0; color: #334155;"><strong>Username:</strong> ${email}</p>
          <p style="margin: 4px 0; color: #334155;"><strong>Password:</strong> ${password}</p>
        </div>
        <p style="color: #64748b; font-size: 14px;">We recommend changing your password after your first login.</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="color: #94a3b8; font-size: 12px; margin: 0;">Best Regards,<br>The PaperGen Team</p>
      </div>
    `;
    return this.sendMail(email, subject, html);
  }

  async sendSchoolApproval(email: string, schoolName: string, adminName: string, password: string) {
    const subject = `Registration Approved - ${schoolName}`;
    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';
    const loginUrl = `${frontendUrl}/login`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff;">
        <h2 style="color: #1e293b; margin-top: 0;">Congratulations, ${adminName}!</h2>
        <p style="color: #475569; font-size: 15px; line-height: 1.6;">
          Your request for school registration for <b>${schoolName}</b> has been approved.
        </p>
        <div style="background-color: #f8fafc; border-left: 4px solid #10b981; padding: 16px; margin: 20px 0; border-radius: 4px;">
          <p style="margin: 4px 0; color: #334155;"><strong>Portal URL:</strong> <a href="${loginUrl}" style="color: #4f46e5;">${loginUrl}</a></p>
          <p style="margin: 4px 0; color: #334155;"><strong>Username:</strong> ${email}</p>
          <p style="margin: 4px 0; color: #334155;"><strong>Password:</strong> ${password}</p>
        </div>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="color: #94a3b8; font-size: 12px; margin: 0;">Best Regards,<br>The PaperGen Team</p>
      </div>
    `;
    return this.sendMail(email, subject, html);
  }

  async sendSchoolInvite(email: string, schoolName: string) {
    const subject = `Invitation to join ${schoolName}`;
    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';
    const registerUrl = `${frontendUrl}/register?email=${encodeURIComponent(email)}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff;">
        <h2 style="color: #1e293b; margin-top: 0;">You're Invited!</h2>
        <p style="color: #475569; font-size: 15px; line-height: 1.6;">
          You have been invited to join <b>${schoolName}</b> on PaperGen SaaS.
        </p>
        <div style="margin: 24px 0;">
          <a href="${registerUrl}" style="background-color: #4f46e5; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; font-size: 14px;">
            Complete Registration
          </a>
        </div>
        <p style="color: #64748b; font-size: 13px;">Or copy and paste this link in your browser:<br><a href="${registerUrl}" style="color: #4f46e5; word-break: break-all;">${registerUrl}</a></p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="color: #94a3b8; font-size: 12px; margin: 0;">Best Regards,<br>The PaperGen Team</p>
      </div>
    `;
    return this.sendMail(email, subject, html);
  }

  async sendOtp(email: string, otp: string) {
    const subject = 'Password Reset OTP - PaperGen SaaS';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff;">
        <h2 style="color: #1e293b; margin-top: 0;">Password Reset Request</h2>
        <p style="color: #475569; font-size: 15px; line-height: 1.6;">
          We received a request to reset your password. Use the OTP code below to proceed:
        </p>
        <div style="margin: 24px 0; text-align: center;">
          <div style="background-color: #f1f5f9; display: inline-block; padding: 12px 28px; border-radius: 8px; font-size: 28px; font-weight: bold; letter-spacing: 6px; color: #1e293b;">
            ${otp}
          </div>
        </div>
        <p style="color: #64748b; font-size: 14px;">This OTP will expire in 10 minutes. If you did not make this request, please disregard this email.</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="color: #94a3b8; font-size: 12px; margin: 0;">Best Regards,<br>The PaperGen Team</p>
      </div>
    `;
    return this.sendMail(email, subject, html);
  }

  async sendVerificationEmail(email: string, token: string) {
    const subject = 'Verify your email - PaperGen SaaS';
    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';
    const verifyUrl = `${frontendUrl}/verify-email?token=${token}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff;">
        <h2 style="color: #1e293b; margin-top: 0;">Verify Your Email Address</h2>
        <p style="color: #475569; font-size: 15px; line-height: 1.6;">
          Thank you for registering on <b>PaperGen SaaS</b>. Please click the button below to verify your email address and activate your account:
        </p>
        <div style="margin: 24px 0; text-align: center;">
          <a href="${verifyUrl}" style="background-color: #4f46e5; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; font-size: 15px;">
            Verify Email
          </a>
        </div>
        <p style="color: #64748b; font-size: 13px;">Or copy and paste this link in your browser:<br>
          <a href="${verifyUrl}" style="color: #4f46e5; word-break: break-all;">${verifyUrl}</a>
        </p>
        <p style="color: #94a3b8; font-size: 12px; margin-top: 20px;">This link will expire in 24 hours.</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="color: #94a3b8; font-size: 12px; margin: 0;">Best Regards,<br>The PaperGen Team</p>
      </div>
    `;
    return this.sendMail(email, subject, html);
  }
}
