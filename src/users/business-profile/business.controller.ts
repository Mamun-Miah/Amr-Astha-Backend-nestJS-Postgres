import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BusinessService } from './business.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {
  CreateBusinessProfileDto,
  PatchBusinessProfileDto,
} from './dto/create-business-profile.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import type { JwtUser } from 'src/auth/types/jwt-user.type';

@UseGuards(JwtAuthGuard)
@Controller('user/business-profile')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Post('create')
  async createBusinessProfile(
    @GetUser() user: JwtUser,
    @Body() dto: CreateBusinessProfileDto,
  ) {
    return this.businessService.updateBusinessProfile(user.uuid, dto);
  }

  @Get()
  async getBusinessProfile(@GetUser() user: JwtUser) {
    return this.businessService.getBusinessProfile(user.uuid);
  }
  @Patch('update/:id')
  async patchBusinessProfile(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: JwtUser,
    @Body() dto: PatchBusinessProfileDto,
  ) {
    const userId = user.uuid;
    return this.businessService.patchBusinessProfile(id, userId, dto);
  }
}
