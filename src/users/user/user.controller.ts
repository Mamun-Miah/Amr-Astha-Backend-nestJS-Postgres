import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateSellerProfileDto } from './dto/update-seller-profile.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import type { JwtUser } from 'src/auth/types/jwt-user.type';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('User Profile')
@UseGuards(JwtAuthGuard)
@Controller('user/my-profile')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch()
  @ApiOperation({ summary: 'Update seller profile' })
  @ApiResponse({
    status: 200,
    description: 'Seller profile updated successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  updateSellerProfile(
    @GetUser() user: JwtUser,
    @Body() dto: UpdateSellerProfileDto,
  ) {
    return this.userService.updateSellerProfile(user.uuid, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get seller profile' })
  @ApiResponse({
    status: 200,
    description: 'Seller profile retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Seller profile not found' })
  getSellerProfile(@GetUser() user: JwtUser) {
    return this.userService.getSellerProfile(user.uuid);
  }
}
