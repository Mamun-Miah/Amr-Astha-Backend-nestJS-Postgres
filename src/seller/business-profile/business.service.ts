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
      // console.error(error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to create business profile',
      );
    }
  }
  async getBusinessProfile(uuid: string) {
    try {
      // Find userId
      const findUserbyUuid = await this.prisma.user.findUnique({
        where: { uuid },
        select: { id: true },
      });

      if (!findUserbyUuid) {
        throw new NotFoundException('User not found');
      }

      // Find business
      const getBusinessProfileData = await this.prisma.businessInfo.findFirst({
        where: { userId: findUserbyUuid.id },
        select: {
          businessName: true,
          businessLogoUrl: true,
          businessType: true,
          businessAddress: true,
          businessPhone: true,
          businessEmail: true,
          businessWebsite: true,
          businessTradeLicense: true,
          businessWareHouse: true,
          businessStoreFrontLink: true,
          businessCategoryId: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!getBusinessProfileData) {
        throw new NotFoundException('Business profile not found');
      }

      return {
        success: true,
        data: getBusinessProfileData,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to get business profile');
    }
  }
}
