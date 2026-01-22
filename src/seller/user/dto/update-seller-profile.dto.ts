import { IsString, IsInt, IsOptional, Min, Max } from 'class-validator';

export class UpdateSellerProfileDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsInt()
  @IsOptional()
  @Min(0)
  @Max(3)
  age?: number;

  @IsString()
  @IsOptional()
  // @Min(11)
  // @Max(15)
  phone?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  profileImageUrl?: string;

  @IsString()
  @IsOptional()
  nidImageUrl?: string;
}
