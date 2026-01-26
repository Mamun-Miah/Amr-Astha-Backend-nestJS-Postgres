import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsNotEmpty,
} from 'class-validator';
import { BusinessTypeEnum } from '../business.service';

export class CreateBusinessProfileDto {
  @IsNumber()
  @IsOptional()
  userId: number;

  @IsString()
  @IsNotEmpty()
  businessName: string;

  @IsString()
  @IsOptional()
  businessLogoUrl?: string;

  @IsEnum(BusinessTypeEnum)
  businessType: BusinessTypeEnum;

  @IsString()
  @IsNotEmpty()
  businessAddress: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  businessPhone: string;

  @IsString()
  @IsNotEmpty()
  businessEmail: string;

  @IsString()
  @IsOptional()
  businessWebsite?: string;

  @IsString()
  @IsOptional()
  businessTradeLicense?: string;

  @IsString()
  @IsOptional()
  businessWareHouse?: string;

  @IsString()
  @IsNotEmpty()
  businessStoreFrontLink: string;

  @IsNumber()
  @IsNotEmpty()
  businessCategoryId: number;
}
