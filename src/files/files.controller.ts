import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
  Body,
  Get,
  StreamableFile,
  Param,
  ParseFilePipe, // Added for validation [cite: 48]
  //MaxFileSizeValidator,
  // FileTypeValidator, // Added for security [cite: 88]
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { join } from 'path';
import { createReadStream } from 'fs'; // Required for the 'view' route

@Controller('seller')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload-assets')
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
          //new MaxFileSizeValidator({ maxSize: 10485760 }), // 5MB limit [cite: 94]
          // You can add FileTypeValidator here as well [cite: 95]
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

  @Get('view/:type/:filename')
  getPrivateFile(
    @Param('type') type: string,
    @Param('filename') filename: string,
  ) {
    // Determine the correct subfolder based on the file type
    const subFolder = type === 'nid' ? 'documents' : 'profiles';

    // Construct the full path to the private directory
    const filePath = join(process.cwd(), 'uploads/seller', subFolder, filename);
    console.log('Looking for file at:', filePath);
    const file = createReadStream(filePath);
    return new StreamableFile(file);
  }
}
