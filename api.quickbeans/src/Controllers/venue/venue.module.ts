import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Venue } from './Venue.entity';
import { VenueService } from './venue.service';
import { ProductModule } from '@controllers/product/product.module';
import { VenueController } from './venue.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Venue]), ProductModule],
  providers: [VenueService],
  controllers: [VenueController],
  exports: [VenueService]
})
export class VenueModule {}
