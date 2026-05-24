import { Injectable, UnauthorizedException, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { UserRole, User } from '../users/entities/users.entity';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
    private subscriptionsService: SubscriptionsService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const verificationToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const verificationTokenExpires = new Date();
    verificationTokenExpires.setHours(verificationTokenExpires.getHours() + 24);

    const user = await this.usersService.create({
      ...registerDto,
      role: UserRole.TEACHER,
      schoolId: null,
      isEmailVerified: false,
      verificationToken,
      verificationTokenExpires,
      status: 'ACTIVE', // Teachers are active by default once verified/paid
    });

    try {
      await this.mailService.sendVerificationEmail(user.email, verificationToken);
    } catch (error) {
      console.error('Failed to send verification email:', error);
    }

    return {
      message: 'Registration successful. Please check your email for verification.',
      userId: user.id
    };
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const trimmedEmail = email?.trim();
    const trimmedPass = pass?.trim();
    const user = await this.usersService.findByEmail(trimmedEmail);
    console.log(`[AuthService] Login attempt for: ${trimmedEmail} (Found: ${!!user})`);

    if (user && user.password === trimmedPass) {
      // 1. Check if email is verified (for individual teachers)
      if (user.role === UserRole.TEACHER && !user.schoolId && !user.isEmailVerified) {
        throw new UnauthorizedException('Please verify your email before login. Check your inbox for the verification link.');
      }

      // 2. Check if school account is approved (for School Admin/Teacher)
      if (user.schoolId && (user.status !== 'ACTIVE' && user.status !== 'APPROVED')) {
          throw new UnauthorizedException('Your school account is pending approval by the admin.');
      }

      // 3. Subscription check (Optional: Usually we allow login to Pay, but if the requirement is to BLOCK login, we do it here)
      // I'll skip blocking login for teachers/schools without subscription so they can actually reach the pricing page to pay.
      // However, for teachers WHO ARE PART OF A SCHOOL, we check the school subscription.
      if (user.role === UserRole.TEACHER && user.schoolId) {
          const subscription = await this.subscriptionsService.getActiveSubscription({ schoolId: user.schoolId });
          if (!subscription) {
              throw new UnauthorizedException('Access denied. Your school does not have an active subscription.');
          }
      }
      
      console.log(`[AuthService] Password matched for ${trimmedEmail}`);
      const { password, ...result } = user;
      return result;
    }
    console.error(`[AuthService] Validation failed for ${trimmedEmail}`);
    return null;
  }

  async login(user: any) {
    // Check subscription 
    const hasActiveSubscription = await this.subscriptionsService.hasActiveSubscription({ 
      schoolId: user.schoolId, 
      userId: user.id 
    });

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
