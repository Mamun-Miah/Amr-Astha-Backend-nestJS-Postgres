import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
export const ORDER_CREATION_TOTAL_MARKS = 1 as const;

@Injectable()
export class SetScoreService {
  constructor(private prisma: PrismaService) {}
  async setEvidenceScore(orderId: number) {
    //if no evidence provided
    //check evidence has or not
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
    if (!checkEvidence)
      return {
        score: 80,
      };
    if (!checkEvidence.invoiceUrl || !checkEvidence.profOfDelivery) {
      return {
        score: 90,
      };
    }
    return {
      score: 100,
    };
  }
}
