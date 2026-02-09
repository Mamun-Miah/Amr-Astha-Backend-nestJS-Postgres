import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSellerReviewDto } from './dto/create-seller-review.dto';
import { SetScoreService } from '../set-score/set-score.service';
import { ReviewEnum } from './dto/create-seller-review.dto';
@Injectable()
export class CustomerReviewService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly setScoreService: SetScoreService,
  ) {}

  async createReview(
    dto: CreateSellerReviewDto,
    attachment?: Express.Multer.File,
  ) {
    //find already reviewd order
    const alreadyReviewed = await this.prisma.sellerReview.findFirst({
      where: {
        orderUuid: dto.orderUuid,
      },
    });
    if (alreadyReviewed) {
      return {
        message: 'Already reviewed',
        success: false,
      };
    }
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
    const getScore = await this.setScoreService.setEvidenceScore(order.id);
    const setScore =
      dto.review === ReviewEnum.COMPLETED_AS_AGREED ? getScore.score : 0;

    // ensure order exists
    return this.prisma.sellerReview.create({
      data: {
        orderUuid: dto.orderUuid,
        review: dto.review,
        score: setScore,
        complain: dto.complain,
        businessId: dto.businessId,
        orderId: order.id,
        attachment: attachment ? attachment.path.replace(/\\/g, '/') : null,
      },
    });
  }
}
