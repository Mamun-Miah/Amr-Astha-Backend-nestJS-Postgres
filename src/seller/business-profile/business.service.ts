import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

export enum BusinessTypeEnum {
  WHOLESALE = 'WHOLESALE',
  RETAIL = 'RETAIL',
}

export interface BusinessProfile {
  businessName: string;
  businessLogoUrl?: string | null;
  businessType: BusinessTypeEnum;
  businessAddress: string;
  businessPhone: string;
  businessEmail: string;
  businessWebsite?: string | null;
  businessTradeLicense?: string | null;
  businessWareHouse?: string | null;
  businessStoreFrontLink: string;
  businessCategoryId: number;
}

@Injectable()
export class BusinessService {
  constructor(private prisma: PrismaService) {}

  async updateBusinessProfile(
    uuid: string,
    bussinessProfileData: BusinessProfile,
  ) {
    try {
      // Find userId
      const user = await this.prisma.user.findUnique({
        where: { uuid },
        select: { id: true },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Create business profile
      const business = await this.prisma.businessInfo.create({
        data: {
          userId: user.id,
          businessName: bussinessProfileData.businessName,
          businessLogoUrl: bussinessProfileData.businessLogoUrl,
          businessType: bussinessProfileData.businessType,
          businessAddress: bussinessProfileData.businessAddress,
          businessPhone: bussinessProfileData.businessPhone,
          businessEmail: bussinessProfileData.businessEmail,
          businessWebsite: bussinessProfileData.businessWebsite,
          businessTradeLicense: bussinessProfileData.businessTradeLicense,
          businessWareHouse: bussinessProfileData.businessWareHouse,
          businessStoreFrontLink: bussinessProfileData.businessStoreFrontLink,
          businessCategoryId: bussinessProfileData.businessCategoryId,
        },
      });

      return {
        success: true,
        data: business,
      };
    } catch (error) {
      // Log error
      console.error(error);

      // If it's already a NestJS exception, rethrow it
      if (error instanceof NotFoundException) {
        throw error;
      }

      // Prisma errors and others
      throw new InternalServerErrorException(
        'Failed to create business profile',
      );
    }
  }
}
