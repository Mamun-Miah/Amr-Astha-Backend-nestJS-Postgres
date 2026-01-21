import { IsNotEmpty, IsString, Length } from 'class-validator';

export class RequestOtpDto {
  @IsNotEmpty()
  uuid: string;
}

export class VerifyOtpDto {
  @IsNotEmpty()
  uuid: string;

  @IsString()
  @Length(6, 6)
  code: string;
}
