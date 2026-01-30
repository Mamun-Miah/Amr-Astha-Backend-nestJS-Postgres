import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSellerReviewDto } from './dto/create-seller-review.dto';

@Injectable()
export class CustomerReviewService {
  constructor(private readonly prisma: PrismaService) {}

  async createReview(
    dto: CreateSellerReviewDto,
    attachment?: Express.Multer.File,
  ) {
    // ensure OrderCreationexist
    const order = await this.prisma.orderCreation.findUnique({
      where: {
        uuid: dto.orderUuid,
      },
      select: {
        id: true,
      },
    });
    if (!order) {
      throw new Error('Order not found');
    }

    // ensure order exists
    return this.prisma.sellerReview.create({
      data: {
        review: dto.review,
        complain: dto.complain,
        orderId: order.id,
        attachment: attachment ? attachment.path.replace(/\\/g, '/') : null,
      },
    });
  }
}
