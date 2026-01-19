/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, BadRequestException } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthProvider } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
export const roundsOfHashing = 10;
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup(registerUserDto: RegisterUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerUserDto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }
    const hashedPassword = await bcrypt.hash(
      registerUserDto.password,
      roundsOfHashing,
    );
    registerUserDto.password = hashedPassword;
    const user = await this.prisma.user.create({
      data: {
        name: registerUserDto.name,
        email: registerUserDto.email,
        phone: registerUserDto.phone,
        provider: AuthProvider.EMAIL,
        passwordHash: hashedPassword,
      },
    });
    const { passwordHash, ...result } = user;
    return result;
  }
}
