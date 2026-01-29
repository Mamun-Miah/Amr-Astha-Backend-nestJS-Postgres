import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateSellerProfileDto } from './dto/update-seller-profile.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import type { JwtUser } from 'src/auth/types/jwt-user.type';

@UseGuards(JwtAuthGuard)
@Controller('user/my-profile')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch()
  updateSellerProfile(
    @GetUser() user: JwtUser,
    @Body() dto: UpdateSellerProfileDto,
  ) {
    return this.userService.updateSellerProfile(user.uuid, dto);
  }

  @Get()
  getSellerProfile(@GetUser() user: JwtUser) {
    return this.userService.getSellerProfile(user.uuid);
  }
}
