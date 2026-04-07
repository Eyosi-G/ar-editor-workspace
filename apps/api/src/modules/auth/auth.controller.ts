import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { VerifyEmailDto } from './dto/verify_email.dto';
import { ResendOtpDto } from './dto/resend_otp.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() loginDto: LoginDto) {
    await this.authService.login(loginDto);
  }

  @Post('/verify-email')
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return await this.authService.verifyEmail(verifyEmailDto);
  }

  @Post('/resend-otp')
  async resendEmail(@Body() resendOtpDto: ResendOtpDto) {
    return await this.authService.resendEmail(resendOtpDto);
  }
}
