import { Order } from '@controllers/order/Order.entity';
import { IOrderStatusUpdate, IOrderSubscription } from '@models/order.dto';
import { ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { ConnectedSocket, MessageBody, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Repository } from 'typeorm';

/**
 * WebSocket Gateway for Events.
 *
 * Events:
 * - Subscribe to order updates by receipt number and user ID.
 * - Unsubscribe from order updates.
 * Emits order status updates to subscribed clients.
 *
 * Connect via ws://host/events
 */
@ApiTags('Events')
@WebSocketGateway({
  namespace: 'events',
  transports: ['websocket'],
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || []
  }
})
export class EventsGateway implements OnGatewayDisconnect {
  constructor(@InjectRepository(Order) private readonly orderRepository: Repository<Order>) {}
  @WebSocketServer()
  server: Server;

  // Map: socket.id -> { receiptNumber, userId }
  private activeOrderSockets = new Map<string, IOrderSubscription>();
  @SubscribeMessage('subscribeOrder')
  async handleSubscribeOrder(@MessageBody() data: IOrderSubscription, @ConnectedSocket() client: Socket) {
    // Store the subscription
    this.activeOrderSockets.set(client.id, {
      receiptNumber: data.receiptNumber,
      userId: data.userId,
      venueId: data.venueId
    });
    // Optionally, send current order status
    const order = await this.orderRepository.findOne({
      where: { receiptNumber: data.receiptNumber, venue: { id: data.venueId } }
    });
    client.emit('orderStatus', { receiptNumber: order?.receiptNumber, status: order?.bookingStatus });
  }

  @SubscribeMessage('unsubscribeOrder')
  handleUnsubscribeOrder(@ConnectedSocket() client: Socket) {
    this.activeOrderSockets.delete(client.id);
  }

  // Clean up on disconnect
  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.activeOrderSockets.delete(client.id);
  }

  // Call this method from your order service when bookingStatus changes, only updates and emits if active listeners
  notifyOrderStatusUpdate(orderStatus: IOrderStatusUpdate) {
    for (const [socketId, sub] of this.activeOrderSockets.entries()) {
      if (sub.receiptNumber === orderStatus.receiptNumber) {
        this.server.to(socketId).emit('orderStatus', orderStatus);
      }
    }
  }
}
