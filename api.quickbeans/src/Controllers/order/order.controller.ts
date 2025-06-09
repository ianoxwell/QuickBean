import { CMessage } from '@base/message.class';
import { EBookingStatus } from '@models/base.dto';
import { IOrder } from '@models/order.dto';
import { Body, Controller, Get, HttpStatus, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OrderService } from './order.service';

@ApiTags('Order')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('JWT-auth')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() orderData: IOrder): Promise<IOrder | CMessage> {
    if (!orderData.venueId || (!orderData.patronId && !orderData.patron?.email) || !orderData.items || !orderData.items.length) {
      return new CMessage('Venue ID, User ID, and items are required.', HttpStatus.BAD_REQUEST);
    }

    return this.orderService.createOrder(orderData);
  }

  @Get('patron')
  async getOrdersByPatronId(@Query('patronId') patronId: number): Promise<IOrder[] | CMessage> {
    if (!patronId) {
      return new CMessage('Patron ID is required.', HttpStatus.BAD_REQUEST);
    }

    const orders = await this.orderService.findOrdersByPatronId(patronId);
    if (!orders || orders.length === 0) {
      return new CMessage(`No orders found for patron with ID ${patronId}.`, HttpStatus.NOT_FOUND);
    }

    return orders;
  }

  // TODO ensure that the user is a venue staff member
  @Post('update-order')
  async updateOrderStatus(
    @Body() orderData: { receiptNumber: string; status: EBookingStatus }
  ): Promise<{ receiptNumber: string; status: EBookingStatus } | CMessage> {
    const updatedOrder = await this.orderService.updateOrderStatus(orderData.receiptNumber, orderData.status);
    console.log('Updated order:', updatedOrder, orderData);
    if (!updatedOrder) {
      return new CMessage(`Order with ID ${orderData.receiptNumber} not found.`, HttpStatus.NOT_FOUND);
    }

    return updatedOrder;
  }
}
