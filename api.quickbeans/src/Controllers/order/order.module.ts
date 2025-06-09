import { EventsModule } from '@controllers/events/events.module';
import { UserModule } from '@controllers/user/user.module';
import { VenueModule } from '@controllers/venue/venue.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './Order.entity';
import { OrderItem } from './OrderItem.entity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem]), EventsModule, VenueModule, UserModule],
  providers: [OrderService],
  controllers: [OrderController],
  exports: [OrderService]
})
export class OrderModule {}
