import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, WsResponse } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Observable, from, map } from 'rxjs';

@WebSocketGateway({
  cors: {
    origin: '*'
  }
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('events')
  findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
    return from([1, 2, 3]).pipe(map((item) => ({ event: 'events', data: item })));
  }

  @SubscribeMessage('identity')
  async identity(@MessageBody() data: number): Promise<number> {
    return data;
  }
}
