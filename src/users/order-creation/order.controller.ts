import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './order.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import type { JwtUser } from 'src/auth/types/jwt-user.type';
@UseGuards(AuthGuard('jwt'))
@Controller('user/orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('create')
  createOrder(
    @GetUser() user: JwtUser,
    @Query('businessId', ParseIntPipe) businessId: number,
    @Body() orderData: CreateOrderDto,
  ) {
    return this.orderService.createOrder(
      user.id,
      businessId,
      orderData,
      user.uuid,
    );
  }
  @Get()
  getOrders(@GetUser() user: JwtUser) {
    return this.orderService.getOrders(user.id);
  }
}
