/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthProvider } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
// 1. Import Pino decorators
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

export const roundsOfHashing = 12;

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    //Inject the logger with the class context
    @InjectPinoLogger(AuthService.name)
    private readonly logger: PinoLogger,
  ) {}

  async signup(dto: RegisterUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      // Log conflict attempts (Warning level)
      this.logger.warn(
        { email: dto.email },
        'Signup attempt failed: Email already exists',
      );
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

    // Log successful creation (Info level)
    this.logger.info(
      { userId: user.id, email: user.email },
      'User successfully registered',
    );

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
