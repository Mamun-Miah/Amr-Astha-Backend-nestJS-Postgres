import {
  IsString,
  IsNumber,
  IsOptional,
  IsEmail,
  IsDateString,
  IsInt,
} from 'class-validator';

export class CreateOrderDto {
  @IsDateString()
  orderDate: string;

  @IsDateString()
  deliveryDate: string;

  @IsString()
  productName: string;

  @IsString()
  productDescription: string;

  @IsNumber()
  productPrice: number;

  @IsNumber()
  productQuantity: number;

  @IsString()
  customerName: string;

  @IsOptional()
  @IsEmail()
  customerEmail?: string;

  @IsString()
  customerPhone: string;

  @IsString()
  customerAddress: string;

  @IsString()
  invoiceNumber: string;

  @IsString()
  invoiceUrl: string;

  @IsString()
  profOfDelivery: string;
}
export class CreateLinkDto {
  @IsString()
  link: string;

  @IsDateString()
  expiry: string;

  @IsInt()
  orderId: number;
}
