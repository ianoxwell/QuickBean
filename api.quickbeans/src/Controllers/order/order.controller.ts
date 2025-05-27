import { CMessage } from '@base/message.class';
import { IOrder } from '@models/order.dto';
import { Body, Controller, Get, HttpStatus, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OrderService } from './order.service';

@ApiTags('Order')
// @UseGuards(AuthGuard('jwt'))
// @ApiBearerAuth('JWT-auth')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() orderData: IOrder): Promise<IOrder | CMessage> {
    if (!orderData.venueId || !orderData.patronId || !orderData.items || !orderData.items.length) {
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
}
