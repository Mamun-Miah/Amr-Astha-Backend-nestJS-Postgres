import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateSellerProfileDto } from './dto/update-seller-profile.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
@Controller('seller/my-profile')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  updateSellerProfile(
    @Param('id') id: string,
    @Body() dto: UpdateSellerProfileDto,
  ) {
    return this.userService.updateSellerProfile(id, dto);
  }
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  getSellerProfile(@Param('id') id: string) {
    return this.userService.getSellerProfile(id);
  }
}
