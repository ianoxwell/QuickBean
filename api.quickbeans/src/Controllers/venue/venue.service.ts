import { CMessage } from '@base/message.class';
import { ProductService } from '@controllers/product/product.service';
import { User } from '@controllers/user/User.entity';
import { mapUserToSummary } from '@controllers/user/user.utils';
import { ERole } from '@models/base.dto';
import { IVenue, IVenueShort, IVenueWithProducts } from '@models/venue.dto';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { put } from '@vercel/blob';
import type { Multer } from 'multer';
import { Repository } from 'typeorm';
import { Venue } from './Venue.entity';
import { mapVenueToIVenue, mapVenueToIVenueProducts, mapVenueToIVenueShort, userHasAccessToVenue } from './venue.utils';

@Injectable()
export class VenueService {
  constructor(
    @InjectRepository(Venue) private readonly venueRepository: Repository<Venue>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
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

    return mapVenueToIVenue(venue);
  }

  async findBySlug(slug: string): Promise<IVenueShort | null> {
    const venue = await this.venueRepository.findOne({ where: { slug, isActive: true } });
    if (!venue) {
      return null;
    }

    return mapVenueToIVenueShort(venue);
  }

  async findByIdWithProducts(id: number, userId: number): Promise<IVenueWithProducts | CMessage> {
    const venue = await this.venueRepository.findOne({ where: { id, isActive: true } });
    if (!venue) {
      return null;
    }

    const user: User | undefined = await this.userRepository.findOne({ where: { id: userId }, relations: ['venues'] });
    if (!user) {
      return new CMessage(`User with ID ${userId} not found.`, HttpStatus.NOT_FOUND);
    }

    if (!userHasAccessToVenue(mapUserToSummary(user), venue, [ERole.ADMIN])) {
      console.log(`User with ID ${userId} does not have access to venue with ID ${id}.`, user.roles, user.venues);

      return new CMessage(`User with ID ${userId} does not have access to venue with ID ${id}.`, HttpStatus.FORBIDDEN);
    }

    const products = await this.productService.findByVenueId(venue.id);
    return mapVenueToIVenueProducts(venue, products);
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
      return mapVenueToIVenue(savedVenue);
    } catch (error: unknown) {
      return new CMessage(
        `Error creating venue: ${error instanceof Error && 'message' in error ? error.message : JSON.stringify(error)}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateVenue(id: number, venueData: Partial<IVenue>): Promise<IVenue | CMessage> {
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
      return mapVenueToIVenue(updatedVenue);
    } catch (error: unknown) {
      return new CMessage(
        `Error updating venue: ${error instanceof Error && 'message' in error ? error.message : JSON.stringify(error)}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
  async uploadVenueImage(venueId: number, file: Multer.File): Promise<string> {
    // TODO: User needs to install @vercel/blob and configure BLOB_READ_WRITE_TOKEN environment variable
    // npm install @vercel/blob

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      throw new Error('BLOB_READ_WRITE_TOKEN environment variable is not set.');
    }

    if (!file || typeof file !== 'object' || !('buffer' in file) || !('originalname' in file)) {
      throw new Error('Invalid file object provided.');
    }
    const fileName = `venue-logos/${venueId}-${Date.now()}-${file.originalname}`;

    try {
      const { url } = await put(fileName, (file as Multer.File).buffer, {
        access: 'public',
        token: process.env.BLOB_READ_WRITE_TOKEN
      });

      // Update the venue's logoImage in the database with the Vercel Blob URL
      const venue = await this.venueRepository.findOne({ where: { id: venueId } });
      if (venue) {
        venue.logoImage = url;
        await this.venueRepository.save(venue);
      }

      return url;
    } catch (error) {
      console.error('Error uploading to Vercel Blob:', error);
      throw new Error('Failed to upload image to Vercel Blob.');
    }
  }

 
}
