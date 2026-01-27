import {
  // ForbiddenException,
  Injectable,
  // NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FilesService {
  constructor(private prisma: PrismaService) {}
  //update files upload path
  async updateUserPaths(
    uuid: string,
    profilePath?: string,
    nidPath?: string,
    businessLogoPath?: string,
    businessId?: number,
  ) {
    try {
      if (businessLogoPath && businessId) {
        return await this.prisma.businessInfo.update({
          where: { id: businessId },
          data: {
            businessLogoUrl: businessLogoPath.replace(/\\/g, '/'),
          },
        });
      }
      return await this.prisma.user.update({
        where: { uuid: uuid },
        data: {
          ...(profilePath && {
            profileImageUrl: profilePath.replace(/\\/g, '/'),
          }),
          ...(nidPath && {
            nidImageUrl: nidPath.replace(/\\/g, '/'),
          }),
        },
      });
    } catch (error: unknown) {
      console.error('Error updating user paths:', error);
      throw error;
    }
  }

  async validateFileAccess(
    userUuid: string,
    requestedPath: string,
  ): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { uuid: userUuid },
      select: { profileImageUrl: true, nidImageUrl: true },
    });

    if (!user) return false;

    // Normalizing paths to ensure the comparison works (replaces \ with /)
    const normRequested = requestedPath.replace(/\\/g, '/');
    const normProfile = user.profileImageUrl?.replace(/\\/g, '/');
    const normNid = user.nidImageUrl?.replace(/\\/g, '/');

    return normRequested === normProfile || normRequested === normNid;
  }
  async validateBusinessLogoAccess(
    businessId: number,
    requestedPath: string,
  ): Promise<boolean> {
    // Find business info owned by this user
    const business = await this.prisma.businessInfo.findFirst({
      where: {
        id: businessId,
      },
      select: {
        businessLogoUrl: true,
      },
    });

    if (!business?.businessLogoUrl) return false;

    const normRequested = requestedPath.replace(/\\/g, '/');
    const normLogo = business.businessLogoUrl.replace(/\\/g, '/');

    return normRequested === normLogo;
  }
}
