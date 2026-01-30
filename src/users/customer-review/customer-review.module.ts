import { Module } from '@nestjs/common';
import { CustomerReviewService } from './customer-review.service';
import { CustomerReviewController } from './customer-review.controller';

@Module({
  providers: [CustomerReviewService],
  controllers: [CustomerReviewController],
})
export class CustomerReviewModule {}
