import { IsNotEmpty, IsString, IsUUID, Length } from 'class-validator';

export class RequestOtpDto {
  @IsNotEmpty()
  @IsUUID()
  uuid: string;
}

export class VerifyOtpDto {
  @IsNotEmpty()
  uuid: string;

  @IsString()
  @Length(6, 6)
  code: string;
}
