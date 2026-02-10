import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
export const ORDER_CREATION_TOTAL_MARKS = 1 as const;

@Injectable()
export class SetScoreService {
  constructor(private prisma: PrismaService) {}
  async setEvidenceScore(orderId: number) {
    //if no evidence provided
    //check evidence has or not
    if (!orderId) {
      throw new Error('OrderId not found');
    }
    const checkEvidence = await this.prisma.orderCreation.findFirst({
      where: {
        id: orderId,
      },
      select: {
        // id: true,
        // uuid: true,
        invoiceUrl: true,
        profOfDelivery: true,
      },
    });
    if (!checkEvidence) {
      throw new Error('Order not found');
    }
    const score =
      checkEvidence.invoiceUrl || checkEvidence.profOfDelivery ? 100 : 80;
    ////////////////////////////////////
    //save score to the main score board
    //find user id
    ////////////////////////////////////
    const userId = await this.prisma.orderCreation.findFirst({
      where: {
        id: orderId,
      },
      select: {
        userId: true,
      },
    });
    if (!userId) {
      throw new Error('User not found');
    }
    //save score to seller score
    await this.prisma.sellerScore.upsert({
      where: {
        userId: userId.userId,
      },
      create: {
        userId: userId.userId,
        // totalScore omitted → default 0
      },
      update: {
        totalScore: {
          increment: score,
        },
      },
    });
    ////////////////////////////////////
    //return score to customer service
    return {
      score,
    };
  }
}
