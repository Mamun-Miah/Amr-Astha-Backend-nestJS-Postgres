import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
export interface SellerProfileData {
  name?: string;
  phone?: string;
  address?: string;
  profileImageUrl?: string;
  nidImageUrl?: string;
}
@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    @InjectPinoLogger(UserService.name)
    private readonly logger: PinoLogger,
  ) {}
  //create seller myprofile
  async updateSellerProfile(
    sellerUUID: string,
    sellerProfileData: SellerProfileData,
  ) {
    //find user by uuid
    const user = await this.prisma.user.findUnique({
      where: { uuid: sellerUUID },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Update user profile
    try {
      const user = await this.prisma.user.update({
        where: { uuid: sellerUUID },
        data: sellerProfileData,
        select: {
          uuid: true,
          name: true,
          phone: true,
          email: true,
          address: true,
          nidImageUrl: true,
          profileImageUrl: true,
        },
      });
      this.logger.info({ sellerUUID }, 'Seller profile updated successfully');
      return {
        success: true,
        data: user,
      };
    } catch (error: unknown) {
      this.logger.error(
        {
          err: error instanceof Error ? error : new Error(String(error)),
          sellerUUID,
        },
        'Failed to update seller profile',
      );
      throw new InternalServerErrorException('Failed to update seller profile');
    }
  }
  async getSellerProfile(sellerUUID: string) {
    //find user by uuid

    try {
      const user = await this.prisma.user.findUnique({
        where: { uuid: sellerUUID },
        select: {
          uuid: true,
          name: true,
          phone: true,
          email: true,
          address: true,
          nidImageUrl: true,
          profileImageUrl: true,
        },
      });
      if (!user) {
        throw new BadRequestException('User not found');
      }
      return { success: true, data: user };
    } catch (error: unknown) {
      this.logger.error(
        {
          error: error,
        },
        'Failed to get seller profile',
      );
      throw new InternalServerErrorException('Failes to get seller profile');
    }
  }
}
