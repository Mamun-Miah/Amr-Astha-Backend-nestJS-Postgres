import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './seller/user/user.module';
import * as Joi from 'joi';
import { LoggerModule } from 'nestjs-pino/LoggerModule';
import { MailModule } from './mail/mail.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { FilesModule } from './files/files.module';
import { OrderModule } from './seller/order-creation/order.module';
import { BusinessModule } from './seller/business-profile/business.module';
import { ShareLinkModule } from './seller/share-link/share-link.module';
@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        redact: {
          paths: [
            'req.headers.authorization',
            'req.body.password',
            'res.headers["set-cookie"]',
          ],
          remove: true,
        },
        autoLogging: true,
        transport:
          process.env.NODE_ENV === 'production'
            ? undefined
            : {
                target: 'pino-pretty',
                options: {
                  colorize: true,
                  translateTime: 'SYS:standard',
                },
              },
      },
    }),
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        JWT_SECRET: Joi.string().required(),
        DATABASE_URL: Joi.string().required(),
        JWT_EXPIRES_IN: Joi.string().default('1d'),
      }),
    }),
    AuthModule,
    UserModule,
    MailModule,
    FilesModule,
    BusinessModule,
    OrderModule,
    ShareLinkModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
