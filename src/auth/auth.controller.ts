import { Controller, Body, Post, UseGuards, Res, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RequestOtpDto, VerifyOtpDto } from './dto/otp.dto';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import express from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GetUser } from './decorators/get-user.decorator';
import type { JwtUser } from './types/jwt-user.type';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  signup(@Body() dto: RegisterUserDto) {
    return this.authService.signup(dto);
  }

  @Post('login')
  async signin(
    @Body() dto: LoginUserDto,
    @Res({ passthrough: true }) response: express.Response,
  ) {
    const { accessToken, user } = await this.authService.signin(dto);

    response.cookie('Authentication', accessToken, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === 'production',
      secure: true,
      // sameSite: 'lax',
      sameSite: 'none',
      partitioned: true,
      maxAge: 3600000, // 1 hour
      path: '/',
    });

    return { success: true, user };
  }
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 100, ttl: 60000 } })
  @Post('request-otp')
  async requestOtp(@Body() dto: RequestOtpDto) {
    return this.authService.sendOtp(dto.uuid);
  }
  @Post('verify-otp')
  async verifyOtp(
    @Body() dto: VerifyOtpDto,
    @Res({ passthrough: true }) response: express.Response,
  ) {
    const result = await this.authService.verifyOtp(dto.uuid, dto.code);

    if (result.accessToken) {
      response.cookie('Authentication', result.accessToken, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === 'production',
        secure: true,
        // sameSite: 'lax',
        partitioned: true,
        sameSite: 'none',
        maxAge: 3600000,
        path: '/',
      });
    }

    return result;
  }
  @UseGuards(JwtAuthGuard)
  @Get('status')
  getStatus(@GetUser() user: JwtUser) {
    return {
      loggedIn: true,
      user: user,
    };
  }
}
