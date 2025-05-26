import { CMessage } from '@base/message.class';
import { IOrder } from '@models/order.dto';
import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
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
}
