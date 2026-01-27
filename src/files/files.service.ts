import { Injectable } from '@nestjs/common';
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
  ) {
    if (businessLogoPath) {
      //find user id by uuid

      const findUserId = await this.prisma.user.findUnique({
        where: { uuid: uuid },
        select: { id: true },
      });
      if (!findUserId) return;
      return await this.prisma.businessInfo.update({
        where: { id: findUserId.id },
        data: {
          businessLogoUrl: businessLogoPath?.replace(/\\/g, '/'),
        },
      });
    }
    return await this.prisma.user.update({
      where: { uuid: uuid },
      data: {
        ...(profilePath && {
          profileImageUrl: profilePath?.replace(/\\/g, '/'),
        }),
        ...(nidPath && { nidImageUrl: nidPath?.replace(/\\/g, '/') }),
      },
    });
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
}
