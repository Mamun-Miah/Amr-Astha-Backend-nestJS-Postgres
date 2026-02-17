import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateDisputeDto {
  @ApiProperty({ description: 'Order ID associated with the dispute' })
  @IsNumber()
  @IsNotEmpty()
  sellerReviewId: number;

  @ApiProperty({ description: 'issue for the dispute' })
  @IsNotEmpty()
  issue: string;

  @ApiProperty({ description: 'Additional details about the dispute' })
  @IsOptional()
  description: string;

  @ApiProperty({ description: 'File attachment for the dispute (optional)' })
  @IsOptional()
  disputeFile?: Express.Multer.File;
}
