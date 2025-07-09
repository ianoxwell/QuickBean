import { ProductModule } from '@controllers/product/product.module';
import { User } from '@controllers/user/User.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VenueController } from './venue.controller';
import { Venue } from './Venue.entity';
import { VenueService } from './venue.service';

@Module({
  imports: [TypeOrmModule.forFeature([Venue, User]), ProductModule],
  providers: [VenueService],
  controllers: [VenueController],
  exports: [VenueService]
})
export class VenueModule {}
