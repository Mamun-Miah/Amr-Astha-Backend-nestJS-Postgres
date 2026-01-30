import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum ReviewEnum {
  COMPLETED_AS_AGREED = 'COMPLETED_AS_AGREED',
  COMPLETED_WITH_ISSUE = 'COMPLETED_WITH_ISSUE',
  NOT_COMPLETED = 'NOT_COMPLETED',
}

export class CreateSellerReviewDto {
  @IsEnum(ReviewEnum, {
    message:
      'review must be one of: COMPLETED_AS_AGREED | COMPLETED_WITH_ISSUE | NOT_COMPLETED',
  })
  @IsNotEmpty()
  review: ReviewEnum;

  @IsOptional()
  @IsString()
  complain?: string;

  @IsString()
  orderUuid: string;
}
