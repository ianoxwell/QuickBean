import { ProductModule } from '@controllers/product/product.module';
import { VenueModule } from '@controllers/venue/venue.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckoutController } from './checkout.controller';
import { Checkout } from './Checkout.entity';
import { CheckoutService } from './checkout.service';
import { CheckoutCategory } from './CheckoutCategory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Checkout, CheckoutCategory]), ProductModule, VenueModule],
  providers: [CheckoutService],
  controllers: [CheckoutController],
  exports: [CheckoutService]
})
export class CheckoutModule {}
