import { CMessage } from '@base/message.class';
import { CurrentUser } from '@controllers/user/current-user.decorator';
import { IUserJwtPayload } from '@models/user.dto';
import { IVenue, IVenueShort } from '@models/venue.dto';
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
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
  @Post()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  async getVenueById(
    @Body() userVenue: { userId: number; venueId: number },
    @CurrentUser() user: IUserJwtPayload
  ): Promise<IVenue | CMessage> {
    if (!userVenue.venueId) {
      return new CMessage('Venue ID is required.', HttpStatus.BAD_REQUEST);
    }

    if (!userVenue.userId || userVenue.userId !== user.id) {
      return new CMessage('You do not have permission to access this venue.', HttpStatus.FORBIDDEN);
    }
    const { venueId } = userVenue;
    if (isNaN(venueId) || venueId <= 0) {
      return new CMessage('Invalid venue ID provided.', HttpStatus.BAD_REQUEST);
    }

    //TODO insert security check to ensure the user has access to the venue and appropriate roles

    const venue = await this.venueService.findByIdWithProducts(venueId);
    if (!venue) {
      return new CMessage(`Venue with ID ${venueId} not found.`, HttpStatus.NOT_FOUND);
    }

    return venue;
  }
}
