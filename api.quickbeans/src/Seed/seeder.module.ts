import { Checkout } from '@controllers/checkout/Checkout.entity';
import { CheckoutCategory } from '@controllers/checkout/CheckoutCategory.entity';
import { Modifier, ModifierOption } from '@controllers/modifier/Modifier.entity';
import { Order } from '@controllers/order/Order.entity';
import { OrderItem } from '@controllers/order/OrderItem.entity';
import { Product } from '@controllers/product/Product.entity';
import { ProductModifier } from '@controllers/product/ProductModifierJoin.entity';
import { User } from '@controllers/user/User.entity';
import { Venue } from '@controllers/venue/Venue.entity';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

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
      migrations: [],
      synchronize: true
    })
  ],
  providers: []
})
export class SeederModule {}
