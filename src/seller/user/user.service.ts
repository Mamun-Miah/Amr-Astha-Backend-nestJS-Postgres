import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface SellerProfileData {
  name?: string;
  phone?: string;
  address?: string;
  profileImageUrl?: string;
  nidImageUrl?: string;
}
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
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
    const updatedUser = await this.prisma.user.update({
      where: { uuid: sellerUUID },
      data: {
        ...sellerProfileData,
      },
    });

    return updatedUser;
  }
}
