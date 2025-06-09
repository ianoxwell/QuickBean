import { Order } from '@controllers/order/Order.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsGateway } from './events.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Order])],
  providers: [EventsGateway],
  exports: [EventsGateway]
})
export class EventsModule {}
