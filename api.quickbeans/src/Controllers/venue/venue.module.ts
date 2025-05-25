import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Venue } from './Venue.entity';
import { VenueService } from './venue.service';

@Module({
  imports: [TypeOrmModule.forFeature([Venue])],
  providers: [VenueService],
  controllers: [],
  exports: [VenueService]
})
export class VenueModule {}
