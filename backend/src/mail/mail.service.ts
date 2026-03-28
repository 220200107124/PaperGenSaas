import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST'),
      port: this.configService.get<number>('MAIL_PORT'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASS'),
      },
    });
  }

  async sendMail(to: string, subject: string, html: string) {
    try {
      const info = await this.transporter.sendMail({
        from: this.configService.get<string>('MAIL_FROM'),
        to,
        subject,
        html,
      });
      console.log('Message sent: %s', info.messageId);
      return info;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  async sendTeacherRegistration(email: string, name: string, password: string) {
    const subject = 'Welcome to paperGeneration saas - Teacher Registration';
    const html = `
      <h1>Welcome, ${name}!</h1>
      <p>Thank you for registering as a teacher on paper saas.</p>
      <p>Your account is now active. Here are your login credentials:</p>
      <p><b>Username:</b> ${email}</p>
      <p><b>Password:</b> ${password}</p>
      <br>
      <p>Best Regards,<br> paperGeneration Team</p>
    `;
    return this.sendMail(email, subject, html);
  }

  async sendSchoolApproval(email: string, schoolName: string, adminName: string, password: string) {
    const subject = `Registration Approved - ${schoolName}`;
    const html = `
      <h1>Congratulations, ${adminName}!</h1>
      <p>Your request for school registration for <b>${schoolName}</b> has been approved.</p>
      <p>You can now log in to the portal using the following credentials:</p>
      <p><b>Username:</b> ${email}</p>
      <p><b>Password:</b> ${password}</p>
      <br>
      <p>Best Regards,<br>paperGeneration Team</p>
    `;
    return this.sendMail(email, subject, html);
  }

  async sendSchoolInvite(email: string, schoolName: string) {
    const subject = `Invitation to join ${schoolName}`;
    const html = `
      <h1>Hello!</h1>
      <p>You have been invited to join <b>${schoolName}</b> on paperGeneration.</p>
      <p>Please click the link below to complete your registration:</p>
      <a href="http://localhost:5173/register?email=${email}">Complete Registration</a>
      <br>
      <p>Best Regards,<br>paperGeneration Team</p>
    `;
    return this.sendMail(email, subject, html);
  }

  async sendOtp(email: string, otp: string) {
    const subject = 'Password Reset OTP - paperGeneration';
    const html = `
      <h1>Password Reset Request</h1>
      <p>Your OTP for password reset is: <b>${otp}</b></p>
      <p>This OTP will expire in 10 minutes.</p>
      <p>If you did not request this, please ignore this email.</p>
      <br>
      <p>Best Regards,<br>paperGeneration Team</p>
    `;
    return this.sendMail(email, subject, html);
  }

  async sendVerificationEmail(email: string, token: string) {
    const subject = 'Verify your email - paperGeneration';
    const verifyUrl = `http://localhost:5173/verify-email?token=${token}`;
    const html = `
      <h1>Email Verification</h1>
      <p>Thank you for registering. Please click the link below to verify your email address:</p>
      <a href="${verifyUrl}">${verifyUrl}</a>
      <p>This verification link will expire in 24 hours.</p>
      <br>
      <p>Best Regards,<br>paperGeneration Team</p>
    `;
    return this.sendMail(email, subject, html);
  }
}
