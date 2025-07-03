import { ICheckoutCategoryWithProducts } from './checkout-category.dto';
import { IVenue } from './venue.dto';

export interface ICheckoutShort {
  id: number;
  name: string;
  slug: string;
  checkoutUrl: string;
  heroImage?: string;
}

export interface ICheckout extends ICheckoutShort {
  description: string;
  heroImageTextColor: string;
  categories: ICheckoutCategoryWithProducts[];
  venue?: IVenue;
}

export interface ICheckoutQuery {
  slug: string;
  venueSlug: string;
}
