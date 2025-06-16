import { Order } from '@controllers/order/Order.entity';
import { mapOrderToIOrder } from '@controllers/order/order.util';
import { IKitchenOrderSubscription, IOrderStatusUpdate, IOrderSubscription } from '@models/order.dto';
import { ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { ConnectedSocket, MessageBody, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Between, Repository } from 'typeorm';

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
  private activeClientOrderSockets = new Map<string, IOrderSubscription>();
  private activeKitchenOrderSockets = new Map<string, IKitchenOrderSubscription>();
  @SubscribeMessage('subscribeOrder')
  async handleSubscribeOrder(@MessageBody() data: IOrderSubscription, @ConnectedSocket() client: Socket) {
    // Store the subscription
    this.activeClientOrderSockets.set(client.id, {
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
    this.activeClientOrderSockets.delete(client.id);
  }

  // Clean up on disconnect
  handleDisconnect(@ConnectedSocket() client: Socket) {
    // if the client id is in activeClientOrderSockets, remove it
    if (this.activeClientOrderSockets.has(client.id)) {
      this.activeClientOrderSockets.delete(client.id);
    } else if (this.activeKitchenOrderSockets.has(client.id)) {
      this.activeKitchenOrderSockets.delete(client.id);
    }
  }

  // Kitchen subscribes to all active orders for a venue
  @SubscribeMessage('subscribeKitchenOrders')
  async handleSubscribeKitchenOrders(@MessageBody() data: IKitchenOrderSubscription, @ConnectedSocket() client: Socket) {
    // Store the subscription
    this.activeKitchenOrderSockets.set(client.id, {
      userId: data.userId,
      venueId: data.venueId
    });
    // Optionally, send current order status
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const orders = await this.orderRepository.find({
      where: {
        venue: { id: data.venueId },
        orderDate: Between(startOfDay, endOfDay)
      },
      order: { orderDate: 'ASC' },
      relations: ['venue', 'patron', 'items', 'items.product']
    });

    client.emit(
      'kitchenOrders',
      orders.map((order) => mapOrderToIOrder(order))
    );
  }

  @SubscribeMessage('unsubscribeKitchenOrder')
  handleUnsubscribeKitchenOrder(@ConnectedSocket() client: Socket) {
    this.activeKitchenOrderSockets.delete(client.id);
  }

  // Call this method from your order service when bookingStatus changes, only updates and emits if active listeners
  notifyOrderStatusUpdate(orderStatus: IOrderStatusUpdate) {
    for (const [socketId, sub] of this.activeClientOrderSockets.entries()) {
      if (sub.receiptNumber === orderStatus.receiptNumber) {
        this.server.to(socketId).emit('orderStatus', orderStatus);
      }
    }
  }

  // Call from the order service when a new booking is made to notify kitchen
  notifyKitchenOrderUpdate(order: Order) {
    for (const [socketId, sub] of this.activeKitchenOrderSockets.entries()) {
      if (sub.venueId === order.venue.id) {
        this.server.to(socketId).emit('kitchenOrders', mapOrderToIOrder(order));
      }
    }
  }
}
