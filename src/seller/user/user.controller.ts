import { Body, Controller, Param, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateSellerProfileDto } from './dto/update-seller-profile.dto';
@Controller('seller/my-profile')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Patch(':id')
  updateSellerProfile(
    @Param('id') id: string,
    @Body() dto: UpdateSellerProfileDto,
  ) {
    return this.userService.updateSellerProfile(id, dto);
  }
}
