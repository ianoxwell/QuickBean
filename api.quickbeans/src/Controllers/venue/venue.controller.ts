import { CMessage } from '@base/message.class';
import { CurrentUser } from '@controllers/user/current-user.decorator';
import { ERole } from '@models/base.dto';
import { IUserJwtPayload } from '@models/user.dto';
import { IVenue, IVenueShort } from '@models/venue.dto';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Multer } from 'multer';
import { VenueService } from './venue.service';

@ApiTags('Venue')
@Controller('venue')
export class VenueController {
  constructor(private readonly venueService: VenueService) {}

  @Get('short')
  async getVenueBySlug(@Query('slug') slug: string): Promise<IVenueShort | CMessage> {
    if (!slug) {
      return new CMessage('Venue slug is required.', HttpStatus.BAD_REQUEST);
    }

    const venue = await this.venueService.findBySlug(slug);
    if (!venue) {
      return new CMessage(`Venue with slug ${slug} not found.`, HttpStatus.NOT_FOUND);
    }

    return venue;
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  async getVenueById(@Body() userVenue: { venueId: number }, @CurrentUser() user: IUserJwtPayload): Promise<IVenue | CMessage> {
    if (!userVenue.venueId) {
      return new CMessage('Venue ID is required.', HttpStatus.BAD_REQUEST);
    }

    if (!user.id || !user.roles) {
      return new CMessage('You do not have permission to access this venue.', HttpStatus.FORBIDDEN);
    }
    const { venueId } = userVenue;
    if (isNaN(venueId) || venueId <= 0) {
      return new CMessage('Invalid venue ID provided.', HttpStatus.BAD_REQUEST);
    }

    //TODO insert security check to ensure the user has access to the venue and appropriate roles

    const venue = await this.venueService.findByIdWithProducts(venueId, user.id);
    if (!venue) {
      return new CMessage(`Venue with ID ${venueId} not found.`, HttpStatus.NOT_FOUND);
    }

    return venue;
  }

  @Post('upload-image/:venueId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 1 * 1024 * 1024 } // 1MB limit
    })
  )
  async uploadVenueImage(
    @Param('venueId') venueId: number,
    @UploadedFile() file: Multer.File,
    @CurrentUser() user: IUserJwtPayload
  ): Promise<{ url: string } | CMessage> {
    if (isNaN(venueId) || venueId <= 0) {
      return new CMessage('Invalid venue ID provided.', HttpStatus.BAD_REQUEST);
    }

    if (!file) {
      return new CMessage('No file uploaded.', HttpStatus.BAD_REQUEST);
    }

    // Check if the user has the admin role
    if (!user.roles || !user.roles.includes(ERole.ADMIN)) {
      return new CMessage('You do not have permission to update venue settings.', HttpStatus.FORBIDDEN);
    }
    // TODO: Add security check to ensure the user has access to upload image for this venue

    try {
      const imageUrl = await this.venueService.uploadVenueImage(venueId, file);
      return { url: imageUrl };
    } catch (error: unknown) {
      // Handle file size limit exceeded error specifically
      if (error instanceof Error && error.message === 'File too large') {
        return new CMessage('File size exceeds the 1MB limit.', HttpStatus.PAYLOAD_TOO_LARGE);
      }

      if (error instanceof Error && error.message.includes('BLOB_READ_WRITE_TOKEN')) {
        return new CMessage(
          'BLOB_READ_WRITE_TOKEN environment variable is not set. Please configure it to upload images.',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

      return new CMessage(`Failed to upload image: ${JSON.stringify(error)}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  async updateVenue(
    @Param('id') id: number,
    @Body() venueData: Partial<IVenue>,
    @CurrentUser() user: IUserJwtPayload
  ): Promise<IVenue | CMessage> {
    if (isNaN(id) || id <= 0) {
      return new CMessage('Invalid venue ID provided.', HttpStatus.BAD_REQUEST);
    }

    // Check if the user has the admin role
    if (!user.roles || !user.roles.includes(ERole.ADMIN)) {
      return new CMessage('You do not have permission to update venue settings.', HttpStatus.FORBIDDEN);
    }

    // TODO: Add security check to ensure the user has access to update this venue
    // For example, check if user.id is associated with the venue being updated

    const updatedVenue = await this.venueService.updateVenue(id, venueData);
    if (!updatedVenue) {
      return new CMessage(`Venue with ID ${id} not found.`, HttpStatus.NOT_FOUND);
    }

    return updatedVenue;
  }
}
