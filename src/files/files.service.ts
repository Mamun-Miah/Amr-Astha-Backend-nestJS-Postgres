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
}
