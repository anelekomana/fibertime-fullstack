import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('request-otp')
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Request OTP using phone number' })
  @ApiBody({
    schema: {
      properties: {
        phoneNumber: { type: 'string' },
      },
    },
  })
  requestOTP(@Body('phoneNumber') phoneNumber: string) {
    return this.authService.requestOTP(phoneNumber);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login using phone number and OTP' })
  @ApiBody({
    schema: {
      properties: {
        phoneNumber: { type: 'string' },
        otp: { type: 'string' },
      },
      required: ['phoneNumber', 'otp'],
    },
  })
  login(@Body('phoneNumber') phoneNumber: string, @Body('otp') otp: string) {
    return this.authService.login(phoneNumber, otp);
  }
}
