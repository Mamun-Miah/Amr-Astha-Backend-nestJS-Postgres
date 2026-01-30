import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { randomUUID } from 'crypto';
@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async createOrder(userId: number, orderData: CreateOrderDto, uuid: string) {
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
    //Link expireation
    const expiryDays = Number(process.env.LINK_EXPIRY_DAYS || 14);
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + expiryDays);
    //Create Link
    const cleanInvoice = order.invoiceNumber.replace(/^INV-/, '');
    const link = `${order.uuid}-${cleanInvoice}-${userId}-${uuid}-${randomUUID()}`;
    //create link data
    const createLink = await this.prisma.linkCreated.create({
      data: {
        link: link,
        expiry: expiryDate,
        orderId: order.id,
      },
    });

    return {
      success: true,
      message: 'Order created successfully',
      data: {
        order: order,
        link: createLink,
      },
    };
  }
  //get orders//
  /////////////
  ////////////
  async getOrders(userId: number) {
    const orders = await this.prisma.orderCreation.findMany({
      where: {
        userId: userId,
      },
      include: {
        linkCreated: {
          select: {
            link: true,
            expiry: true,
          },
        },
      },
    });
    return orders.map((order) => ({
      ...order,
      link: order.linkCreated[0]?.link ?? null,
      linkExpiry: order.linkCreated[0]?.expiry ?? null,
      linkCreated: undefined,
    }));
  }
}
