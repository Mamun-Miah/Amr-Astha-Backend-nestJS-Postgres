import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async createOrder(userId: number, orderData: CreateOrderDto) {
    //create order
    const order = await this.prisma.orderCreation.create({
      data: {
        userId: userId,
        orderDate: orderData.orderDate,
        deliveryDate: orderData.deliveryDate,
        productName: orderData.productName,
        productDescription: orderData.productDescription,
        productPrice: orderData.productPrice,
        productQuantity: orderData.productQuantity,
        customerName: orderData.customerName,
        customerEmail: orderData.customerEmail,
        customerPhone: orderData.customerPhone,
        customerAddress: orderData.customerAddress,
        invoiceNumber: orderData.invoiceNumber,
        invoiceUrl: orderData.invoiceUrl,
        profOfDelivery: orderData.profOfDelivery,
      },
    });
    return order;
  }
}
