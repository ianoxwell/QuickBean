import { OrderService } from '@controllers/order/order.service';
import { ApiTags } from '@nestjs/swagger';
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets';
import { Observable, from, map } from 'rxjs';
import { Server, Socket } from 'socket.io';
import { IOrder } from '@models/order.dto';

interface ActiveOrderSubscription {
  receiptNumber: string;
  userId: number;
}

@ApiTags('Events')
/**
 * WebSocket Gateway for Events.
 *
 * Events:
 * - 'events': Emits numbers 1, 2, 3 to the client.
 * - 'identity': Echoes back the number sent.
 *
 * Connect via ws://host/events
 */
@WebSocketGateway({
  namespace: 'events',
  transports: ['websocket'],
  cors: {
    origin: '*'
  }
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  // Map: socket.id -> { receiptNumber, userId }
  private activeOrderSockets = new Map<string, ActiveOrderSubscription>();
  @SubscribeMessage('subscribeOrder')
  handleSubscribeOrder(@MessageBody() data: { receiptNumber: string; userId: number }, @ConnectedSocket() client: Socket) {
    // Store the subscription
    this.activeOrderSockets.set(client.id, {
      receiptNumber: data.receiptNumber,
      userId: data.userId
    });
    // Optionally, send current order status
    // const order = await this.orderService.findByReceiptNumber(data.receiptNumber);
    // client.emit('orderStatus', order?.bookingStatus);
  }

  @SubscribeMessage('unsubscribeOrder')
  handleUnsubscribeOrder(@ConnectedSocket() client: Socket) {
    this.activeOrderSockets.delete(client.id);
  }

  // Clean up on disconnect
  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.activeOrderSockets.delete(client.id);
  }

  // @SubscribeMessage('events')
  // findAll(@MessageBody() data: any, @ConnectedSocket() client: Socket): Observable<WsResponse<number>> {
  //   console.log('Received data:', data, 'from client:', client.id);
  //   return from([1, 2, 3]).pipe(map((item) => ({ event: 'events', data: item })));
  // }

  // @SubscribeMessage('identity')
  // async identity(@MessageBody() data: number): Promise<number> {
  //   return data;
  // }

  // Call this method from your order service when bookingStatus changes
  notifyOrderStatusUpdate(receiptNumber: string, newStatus: string) {
    for (const [socketId, sub] of this.activeOrderSockets.entries()) {
      if (sub.receiptNumber === receiptNumber) {
        this.server.to(socketId).emit('orderStatus', { receiptNumber, bookingStatus: newStatus });
      }
    }
  }
}
