import { ProductModule } from '@controllers/product/product.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Checkout } from './Checkout.entity';
import { CheckoutService } from './checkout.service';
import { CheckoutCategory } from './CheckoutCategory.entity';
import { VenueModule } from '@controllers/venue/venue.module';

@Module({
  imports: [TypeOrmModule.forFeature([Checkout, CheckoutCategory]), ProductModule, VenueModule],
  providers: [CheckoutService],
  controllers: [],
  exports: [CheckoutService]
})
export class CheckoutModule {}
