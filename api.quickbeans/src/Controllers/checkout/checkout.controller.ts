import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CheckoutService } from './checkout.service';
import { ICheckout } from '@models/checkout.dto';
import { CMessage } from '@base/message.class';

@ApiTags('Checkout')
@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

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
