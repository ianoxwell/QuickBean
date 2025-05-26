import { CMessage } from '@base/message.class';
import { CurrentUser } from '@controllers/user/current-user.decorator';
import { IUserJwtPayload } from '@models/user.dto';
import { IVenue } from '@models/venue.dto';
import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { VenueService } from './venue.service';

@ApiTags('Venue')
// @UseGuards(AuthGuard('jwt'))
// @ApiBearerAuth('JWT-auth')
@Controller('venue')
export class VenueController {
  constructor(private readonly venueService: VenueService) {}

  // , @CurrentUser() user: IUserJwtPayload

  @Get()
  async getVenueBySlug(@Query('slug') slug: string): Promise<IVenue | CMessage> {
    if (!slug) {
      return new CMessage('Slug is required.', HttpStatus.BAD_REQUEST);
    }

    //TODO insert security check to ensure the user has access to the venue and appropriate roles
    // console.log(`User ${user.id} is requesting venue with slug: ${slug}`);

    const venue = await this.venueService.findBySlug(slug);
    if (!venue) {
      return new CMessage(`Venue with slug ${slug} not found.`, HttpStatus.NOT_FOUND);
    }

    return venue;
  }
}
