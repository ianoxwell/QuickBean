import { Controller, Get, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CheckoutService } from './checkout.service';
import { ICheckout, ICheckoutShort } from '@models/checkout.dto';
import { CMessage } from '@base/message.class';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '@controllers/user/current-user.decorator';
import { IUserJwtPayload } from '@models/user.dto';

@ApiTags('Checkout')
@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Get('active-checkouts')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('JWT-auth')
  async getActiveCheckouts(
    @Query('venueId') venueId: string | number,
    @CurrentUser() user: IUserJwtPayload
  ): Promise<ICheckoutShort[] | CMessage> {
    if (!venueId) {
      return new CMessage('Venue ID is required', HttpStatus.BAD_REQUEST);
    }

    venueId = typeof venueId === 'string' ? parseInt(venueId, 10) : venueId;
    if (isNaN(venueId)) {
      return new CMessage('Invalid venue ID format', HttpStatus.BAD_REQUEST);
    }

    const checkouts = await this.checkoutService.findActiveByVenueId(venueId, user.id);
    return checkouts;
  }

  @Get()
  async getCheckoutBySlug(@Query('slug') slug: string, @Query('venueSlug') venueSlug: string): Promise<ICheckout | CMessage> {
    if (!slug) {
      return new CMessage('Checkout slug is required.', HttpStatus.BAD_REQUEST);
    }

    if (!venueSlug) {
      return new CMessage('Venue slug is required.', HttpStatus.BAD_REQUEST);
    }

    // Fetch the checkout by slug
    const checkout = await this.checkoutService.findBySlug(slug, venueSlug);
    if (!checkout) {
      throw new Error(`Checkout with slug ${slug} not found.`);
    }

    return checkout;
  }
}
