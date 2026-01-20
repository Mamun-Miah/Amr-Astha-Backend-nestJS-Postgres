/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthProvider } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer'; // New Import
import * as bcrypt from 'bcryptjs';
import { randomInt } from 'crypto'; // New Import for secure OTP
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

export const roundsOfHashing = 12;

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailerService, // Inject Mailer
    @InjectPinoLogger(AuthService.name)
    private readonly logger: PinoLogger,
  ) {}

  /**
   * PHASE 1: Send OTP to Email
   */
  async sendOtp(email: string) {
    const otp = randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 5 * 60000); // 5 mins expiry

    try {
      // 1. Store OTP in database
      await this.prisma.otp.upsert({
        where: { email },
        update: { code: otp, expiresAt, createdAt: new Date() },
        create: { email, code: otp, expiresAt },
      });

      // 2. Send Email
      await this.mailService.sendMail({
        to: email,
        subject: 'Your Verification Code',
        html: `<h3>Your OTP is: <b>${otp}</b></h3><p>Valid for 5 minutes.</p>`,
      });

      this.logger.info({ email }, 'OTP sent successfully');
      return { message: 'OTP sent to email' };
    } catch (error: unknown) {
      this.logger.error({ error, email }, 'Failed to process OTP request');
      throw new InternalServerErrorException('Error sending verification code');
    }
  }

  /**
   * PHASE 2: Verify OTP
   */
  async verifyOtp(email: string, code: string) {
    const otpRecord = await this.prisma.otp.findUnique({ where: { email } });

    if (
      !otpRecord ||
      otpRecord.code !== code ||
      otpRecord.expiresAt < new Date()
    ) {
      this.logger.warn({ email }, 'Invalid or expired OTP attempt');
      throw new BadRequestException('Invalid or expired code');
    }

    // Delete OTP after successful use (Single use)
    await this.prisma.otp.delete({ where: { email } });

    this.logger.info({ email }, 'OTP verified successfully');
    return { success: true };
  }

  /**
   * SIGNUP (Modified to check if email is verified, or you can call verifyOtp separately)
   */
  async signup(dto: RegisterUserDto) {
    // Logic: In an enterprise app, you'd usually check a 'isVerified' flag in your DB
    // or ensure they verified the OTP right before this step.

    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      this.logger.warn({ email: dto.email }, 'Signup failed: Email exists');
      throw new BadRequestException('Email already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, roundsOfHashing);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
        provider: AuthProvider.EMAIL,
        passwordHash,
      },
    });

    this.logger.info({ userId: user.id }, 'User registered');
    const { passwordHash: _, ...result } = user;
    return result;
  }

  async signin(dto: LoginUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user || !user.passwordHash) {
      // Security log: User not found
      this.logger.warn({ email: dto.email }, 'Login failed: User not found');
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      //Security log: Wrong password
      this.logger.warn(
        { userId: user.id, email: user.email },
        'Login failed: Invalid password',
      );
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      uuid: user.uuid,
      phone: user.phone,
      username: user.name,
    };

    this.logger.info({ userId: user.id }, 'User logged in successfully');

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        uuid: user.uuid,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    };
  }
}
