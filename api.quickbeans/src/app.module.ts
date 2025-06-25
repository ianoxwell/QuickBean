import { Checkout } from '@controllers/checkout/Checkout.entity';
import { CheckoutModule } from '@controllers/checkout/checkout.module';
import { CheckoutCategory } from '@controllers/checkout/CheckoutCategory.entity';
import { EventsModule } from '@controllers/events/events.module';
import { Modifier, ModifierOption } from '@controllers/modifier/Modifier.entity';
import { ModifierModule } from '@controllers/modifier/modifier.module';
import { Order } from '@controllers/order/Order.entity';
import { OrderModule } from '@controllers/order/order.module';
import { OrderItem } from '@controllers/order/OrderItem.entity';
import { Product } from '@controllers/product/Product.entity';
import { ProductModule } from '@controllers/product/product.module';
import { ProductModifier } from '@controllers/product/ProductModifierJoin.entity';
import { StatusModule } from '@controllers/status/status.module';
import { User } from '@controllers/user/User.entity';
import { UserModule } from '@controllers/user/user.module';
import { Venue } from '@controllers/venue/Venue.entity';
import { VenueModule } from '@controllers/venue/venue.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@services/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true // no need to import into other modules
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      database: 'api_quickbeans',
      url: process.env.DATABASE_URL || process.env.PG_URL,
      entities: [Checkout, CheckoutCategory, Modifier, ModifierOption, ProductModifier, Order, OrderItem, Product, User, Venue],
      logging: ['error', 'warn'],
      poolSize: 5,
      maxQueryExecutionTime: 5000,
      migrations: [],
      synchronize: false
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60,
          limit: 10
        }
      ]
    }),
    AuthModule,
    CheckoutModule,
    EventsModule,
    ModifierModule,
    OrderModule,
    ProductModule,
    StatusModule,
    UserModule,
    VenueModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
