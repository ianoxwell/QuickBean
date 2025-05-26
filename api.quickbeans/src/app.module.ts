import { Checkout } from '@controllers/checkout/Checkout.entity';
import { CheckoutCategory } from '@controllers/checkout/CheckoutCategory.entity';
import { Modifier, ModifierOption } from '@controllers/modifier/Modifier.entity';
import { Order } from '@controllers/order/Order.entity';
import { OrderItem } from '@controllers/order/OrderItem.entity';
import { Product } from '@controllers/product/Product.entity';
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
      entities: [Checkout, CheckoutCategory, Modifier, ModifierOption, Order, OrderItem, Product, User, Venue],
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
    StatusModule,
    AuthModule,
    UserModule,
    VenueModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
