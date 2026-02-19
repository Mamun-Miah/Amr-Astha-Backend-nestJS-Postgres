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
import { GetOrderDetailsDto } from './dto/create-order.dto';
import { OrderService } from './order.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import type { JwtUser } from 'src/auth/types/jwt-user.type';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
@ApiTags('Order Creation')
@UseGuards(AuthGuard('jwt'))
@Controller('user/orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
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
  @ApiOperation({ summary: 'Get all orders for a business' })
  @ApiResponse({ status: 200, description: 'Orders retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Orders not found' })
  getOrders(
    @Query('businessId', ParseIntPipe) businessId: number,
    @GetUser() user: JwtUser,
  ) {
    return this.orderService.getOrders(businessId, user.id);
  }

  @Get('details')
  @ApiOperation({ summary: 'Get order details by UUID' })
  @ApiResponse({
    status: 200,
    description: 'Order details retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Order not found' })
  getOrderDetails(@Query() dto: GetOrderDetailsDto) {
    return this.orderService.getOrderById(dto);
  }
}
