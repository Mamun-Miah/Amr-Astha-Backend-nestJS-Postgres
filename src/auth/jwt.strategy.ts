import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { PinoLogger, InjectPinoLogger } from 'nestjs-pino';
interface JwtPayload {
  uuid: string;
  username: string;
  email?: string;
  role?: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    @InjectPinoLogger(JwtStrategy.name)
    private readonly logger: PinoLogger,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,

      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    // Fetch user
    const user = await this.prisma.user.findUnique({
      where: { uuid: payload.uuid },
      select: {
        id: true,
        uuid: true,
        email: true,
        name: true,
        isEmailVerified: true,
        isActive: true,
      },
    });

    //disable users cannot login
    if (!user || !user.isActive) {
      this.logger.warn('User not found or inactive');
      throw new UnauthorizedException('User account is invalid or disabled');
    }
    return user;
  }
}
