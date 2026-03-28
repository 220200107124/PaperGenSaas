import { Injectable, UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { UserRole } from '../users/entities/users.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
    private subscriptionsService: SubscriptionsService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const trimmedEmail = email?.trim();
    const trimmedPass = pass?.trim();
    const user = await this.usersService.findByEmail(trimmedEmail);
    console.log(`[AuthService] Login attempt for: ${trimmedEmail} (Found: ${!!user})`);

    // In a real app, hash and compare passwords
    if (user && user.password === trimmedPass) {
      // School request flow uses ACTIVE, but old backend used APPROVED
      if (user.status !== 'ACTIVE' && user.status !== 'APPROVED') {
        // Individual teachers do NOT require admin approval (even if DB still says PENDING from old flow)
        if (user.role !== UserRole.TEACHER || (user.role === UserRole.TEACHER && user.schoolId !== null)) {
          throw new UnauthorizedException('Your account is not approved yet');
        }
      }

      /* 
      if (user.role === UserRole.TEACHER && !user.schoolId && !user.isEmailVerified) {
        throw new UnauthorizedException('Please verify your email before login');
      }
      */
      
      console.log(`[AuthService] Password matched for ${trimmedEmail}`);
      const { password, ...result } = user;
      return result;
    }
    console.error(`[AuthService] Validation failed for ${trimmedEmail} (Pwd matches: ${user?.password === trimmedPass})`);
    return null;
  }

  async login(user: any) {
    // Bypass subscription check (Development/Request)
    let hasActiveSubscription = true;

    /* 
    // Check subscription for Teacher and School Admin
    if (user.role === UserRole.TEACHER || user.role === UserRole.SCHOOL_ADMIN) {
      if (user.schoolId) {
        hasActiveSubscription = await this.subscriptionsService.hasActiveSubscription(user.schoolId);
      } else {
        hasActiveSubscription = false;
      }
    }
    */

    const payload = { 
      userId: user.id,
      sub: user.id, 
      role: user.role, 
      schoolId: user.schoolId,
      hasActiveSubscription
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        schoolId: user.schoolId,
        schoolName: user.school?.name,
        subjectId: user.subjectId,
        hasActiveSubscription,
        mustChangePassword: user.mustChangePassword
      }
    };
  }

  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User with this email does not exist');
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date();
    otpExpires.setMinutes(otpExpires.getMinutes() + 10); // OTP valid for 10 minutes

    await this.usersService.update(user.id, {
      otp,
      otpExpires,
    });

    try {
      await this.mailService.sendOtp(email, otp);
    } catch (error) {
      console.error('Failed to send OTP email:', error);
      throw new BadRequestException('Failed to send OTP email');
    }

    return { success: true, message: 'OTP sent to your email' };
  }

  async verifyOtp(email: string, otp: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.otp || user.otp !== otp) {
      throw new BadRequestException('Invalid OTP');
    }

    if (user.otpExpires && new Date() > user.otpExpires) {
      throw new BadRequestException('OTP has expired');
    }

    return { success: true, message: 'OTP verified successfully' };
  }

  async resetPassword(resetDto: any) {
    const { email, otp, password } = resetDto;
    
    // Verify OTP again during reset for security
    await this.verifyOtp(email, otp);

    const user = await this.usersService.findByEmail(email);
    
    // Update password and clear OTP
    await this.usersService.update(user!.id, {
      password: password, // In real app, hash this
      otp: null,
      otpExpires: null,
    });

    return { success: true, message: 'Password reset successfully' };
  }

  async sendVerificationEmail(email: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.isEmailVerified) {
      throw new BadRequestException('Email is already verified');
    }

    const verificationToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const verificationTokenExpires = new Date();
    verificationTokenExpires.setHours(verificationTokenExpires.getHours() + 24);

    await this.usersService.update(user.id, {
      verificationToken,
      verificationTokenExpires,
    });

    try {
      await this.mailService.sendVerificationEmail(email, verificationToken);
    } catch (error) {
      console.error('Failed to send verification email:', error);
      throw new BadRequestException('Failed to send verification email');
    }

    return { success: true, message: 'Verification email sent' };
  }

  async verifyEmail(token: string) {
    const user = await this.usersService.findByVerificationToken(token);
    if (!user) {
      throw new BadRequestException('Invalid verification token');
    }

    if (user.verificationTokenExpires && new Date() > user.verificationTokenExpires) {
      throw new BadRequestException('Verification token has expired');
    }

    await this.usersService.update(user.id, {
      isEmailVerified: true,
      verificationToken: null,
      verificationTokenExpires: null,
    });

    return { success: true, message: 'Email verified successfully' };
  }
}
