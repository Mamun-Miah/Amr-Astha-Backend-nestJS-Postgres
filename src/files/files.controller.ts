import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  Body,
  Get,
  StreamableFile,
  ParseFilePipe,
  NotFoundException,
  Query,
  UseGuards,
  ForbiddenException,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { join, normalize } from 'path';
import { createReadStream, existsSync } from 'fs'; // Required for the 'view' route
interface RequestWithUser extends Request {
  user: {
    uuid: string;
    email: string;
  };
}
@Controller('seller')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload-assets')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'profileImage', maxCount: 1 },
      { name: 'nidImage', maxCount: 1 },
    ]),
  )
  async uploadSellerFiles(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          // new MaxFileSizeValidator({ maxSize: 10485760 }),
          // new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
        ],
      }),
    )
    files: {
      profileImage?: Express.Multer.File[];
      nidImage?: Express.Multer.File[];
    },
    @Body('userId') userId: string,
  ) {
    const profileFile = files.profileImage?.[0];
    const nidFile = files.nidImage?.[0];

    // Using await ensures the async Prisma operation completes [cite: 171]
    return await this.filesService.updateUserPaths(
      userId,
      profileFile?.path,
      nidFile?.path,
    );
  }

  @Get('view-file')
  @UseGuards(JwtAuthGuard)
  async getPrivateFile(
    @Query('path') dbPath: string,
    @Req() req: RequestWithUser,
  ): Promise<StreamableFile> {
    if (!dbPath) {
      throw new NotFoundException('No file path provided');
    }
    const isOwner = await this.filesService.validateFileAccess(
      req.user.uuid,
      dbPath,
    );

    if (!isOwner) {
      throw new ForbiddenException('You are not authorized to view this file');
    }
    const absolutePath = join(process.cwd(), normalize(dbPath));

    if (!existsSync(absolutePath)) {
      throw new NotFoundException('File does not exist on the server');
    }

    const file = createReadStream(absolutePath);
    return new StreamableFile(file);
  }
}
