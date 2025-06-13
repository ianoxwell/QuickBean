import { CMessage } from '@base/message.class';
import { IVenue, IVenueShort } from '@models/venue.dto';
import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
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

  // , @CurrentUser() user: IUserJwtPayload
  @Get()
  // @UseGuards(AuthGuard('jwt'))
  // @ApiBearerAuth('JWT-auth')
  async getVenueById(@Query('id') id: number): Promise<IVenue | CMessage> {
    if (!id) {
      return new CMessage('Venue ID is required.', HttpStatus.BAD_REQUEST);
    }

    id = parseInt(id.toString(), 10);
    if (isNaN(id) || id <= 0) {
      return new CMessage('Invalid venue ID provided.', HttpStatus.BAD_REQUEST);
    }

    //TODO insert security check to ensure the user has access to the venue and appropriate roles
    // console.log(`User ${user.id} is requesting venue with slug: ${slug}`);

    const venue = await this.venueService.findByIdWithProducts(id);
    if (!venue) {
      return new CMessage(`Venue with ID ${id} not found.`, HttpStatus.NOT_FOUND);
    }

    return venue;
  }
}
