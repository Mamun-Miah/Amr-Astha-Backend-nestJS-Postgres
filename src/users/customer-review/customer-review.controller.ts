import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { CustomerReviewService } from './customer-review.service';
import { CreateSellerReviewDto } from './dto/create-seller-review.dto';

@Controller('customer-review')
export class CustomerReviewController {
  constructor(private readonly customerReviewService: CustomerReviewService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('attachment', {
      storage: diskStorage({
        destination: './uploads/customer-review/files',
        filename: (_req, file, cb) => {
          const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueName + extname(file.originalname));
        },
      }),
    }),
  )
  async create(
    @Body() dto: CreateSellerReviewDto,
    @UploadedFile() attachment?: Express.Multer.File,
  ) {
    return this.customerReviewService.createReview(dto, attachment);
  }
}
