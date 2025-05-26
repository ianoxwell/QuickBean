import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venue } from './Venue.entity';
import { IVenueWithProducts, IVenueShort } from '@models/venue.dto';
import { IVenue } from '@models/venue.dto';
import { CMessage } from '@base/message.class';
import { ProductService } from '@controllers/product/product.service';
import { IProduct } from '@models/products.dto';

@Injectable()
export class VenueService {
  constructor(
    @InjectRepository(Venue) private readonly venueRepository: Repository<Venue>,
    private productService: ProductService
  ) {}

  async findByIdEntity(id: number): Promise<Venue | null> {
    return this.venueRepository.findOne({ where: { id, isActive: true } });
  }

  async findById(id: number): Promise<IVenue | null> {
    const venue = await this.venueRepository.findOne({ where: { id, isActive: true } });
    if (!venue) {
      return null;
    }

    return this.mapVenueToIVenue(venue);
  }

  async findBySlug(slug: string): Promise<IVenue | null> {
    const venue = await this.venueRepository.findOne({ where: { slug, isActive: true } });
    if (!venue) {
      return null;
    }

    const products = await this.productService.findByVenueId(venue.id);

    return this.mapVenueToIVenueProducts(venue, products);
  }

  async createVenue(venueData: IVenue): Promise<IVenue | CMessage> {
    // confirm that the venue does not already exist
    const existingVenue = await this.venueRepository.findOne({ where: { name: venueData.name } });
    if (existingVenue) {
      return new CMessage(`Venue with name ${venueData.name} already exists.`, HttpStatus.CONFLICT);
    }

    // create a new venue entity
    const newVenue = this.venueRepository.create(venueData);
    try {
      // save the new venue to the database
      const savedVenue = await this.venueRepository.save(newVenue);
      return this.mapVenueToIVenue(savedVenue);
    } catch (error: unknown) {
      return new CMessage(
        `Error creating venue: ${error instanceof Error && 'message' in error ? error.message : JSON.stringify(error)}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateVenue(id: number, venueData: IVenue): Promise<IVenue | CMessage> {
    // find the existing venue
    const existingVenue = await this.venueRepository.findOne({ where: { id } });
    if (!existingVenue) {
      return new CMessage(`Venue with ID ${id} not found.`, HttpStatus.NOT_FOUND);
    }

    // update the venue entity with new data
    Object.assign(existingVenue, venueData);
    try {
      // save the updated venue to the database
      const updatedVenue = await this.venueRepository.save(existingVenue);
      return this.mapVenueToIVenue(updatedVenue);
    } catch (error: unknown) {
      return new CMessage(
        `Error updating venue: ${error instanceof Error && 'message' in error ? error.message : JSON.stringify(error)}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /** Map the Venue entity to IVenue */
  mapVenueToIVenue(venue: Venue): IVenue {
    return {
      ...this.mapVenueToIVenueShort(venue),
      isActive: venue.isActive,
      countryId: venue.countryId,
      openingHours: venue.openingHours,
      address: venue.address,
      city: venue.city,
      state: venue.state,
      postcode: venue.postcode,
      legalBusinessName: venue.legalBusinessName,
      legalBusinessNumber: venue.legalBusinessNumber,
      timezone: venue.timezone,
      privacyPolicy: venue.privacyPolicy,
      websiteUrl: venue.websiteUrl
    };
  }

  /** Map the Venue to IVenueShort */
  mapVenueToIVenueShort(venue: Venue): IVenueShort {
    return {
      id: venue.id,
      name: venue.name,
      slug: venue.slug,
      logoImage: venue.logoImage,
      publicPhone: venue.publicPhone
    };
  }

  mapVenueToIVenueProducts(venue: Venue, products: IProduct[]): IVenueWithProducts {
    return {
      ...this.mapVenueToIVenue(venue),
      products,
      checkoutCategories: [] // Assuming this will be populated elsewhere
    };
  }
}
