import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: any) {
    const user = await this.authService.validateUser(loginDto?.email, loginDto?.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const loginResult = await this.authService.login(user);
    return {
      message: 'Logged in successfully',
      data: loginResult,
    };
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Post('verify-otp')
  async verifyOtp(@Body('email') email: string, @Body('otp') otp: string) {
    return this.authService.verifyOtp(email, otp);
  }

  @Post('reset-password')
  async resetPassword(@Body() resetDto: any) {
    return this.authService.resetPassword(resetDto);
  }

  @Post('send-verification-email')
  async sendVerificationEmail(@Body('email') email: string) {
    return this.authService.sendVerificationEmail(email);
  }

  @Post('verify-email')
  async verifyEmailToken(@Body('token') token: string) {
    return this.authService.verifyEmail(token);
  }
}
