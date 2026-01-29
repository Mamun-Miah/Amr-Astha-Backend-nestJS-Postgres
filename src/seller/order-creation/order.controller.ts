import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderService } from './order.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import type { JwtUser } from 'src/auth/types/jwt-user.type';
@UseGuards(AuthGuard('jwt'))
@Controller('seller/orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('create')
  createOrder(@GetUser() user: JwtUser, @Body() orderData: CreateOrderDto) {
    return this.orderService.createOrder(user.id, orderData);
  }
}
