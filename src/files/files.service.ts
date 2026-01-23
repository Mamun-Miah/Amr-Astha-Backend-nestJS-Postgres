import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FilesService {
  constructor(private prisma: PrismaService) {}

  async updateUserPaths(
    userId: string,
    profilePath?: string,
    nidPath?: string,
  ) {
    return await this.prisma.user.update({
      where: { uuid: userId },
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
