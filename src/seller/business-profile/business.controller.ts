import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { BusinessService } from './business.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateBusinessProfileDto } from './dto/create-business-profile.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import type { JwtUser } from 'src/auth/types/jwt-user.type';

@UseGuards(JwtAuthGuard)
@Controller('seller/business-profile')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Post('create')
  async createBusinessProfile(
    @GetUser() user: JwtUser,
    @Body() dto: CreateBusinessProfileDto,
  ) {
    return this.businessService.updateBusinessProfile(user.uuid, dto);
  }
}
