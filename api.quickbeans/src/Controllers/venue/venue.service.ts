import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venue } from './Venue.entity';
import { IVenueShort } from '@models/venue.dto';

@Injectable()
export class VenueService {
  constructor(@InjectRepository(Venue) private readonly venueRepository: Repository<Venue>) {}

  async findById(id: number): Promise<Venue | null> {
    return this.venueRepository.findOne({ where: { id } });
  }

  /** Map the Venue to IVenueShort */
  mapVenueToIVenueShort(venue: Venue): IVenueShort {
    return {
      id: venue.id,
      name: venue.name,
      logoImage: venue.logoImage,
      websiteUrl: venue.websiteUrl,
      publicPhone: venue.publicPhone
    };
  }
}
