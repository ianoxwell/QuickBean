import { ICheckoutCategoryWithProducts } from './checkout-category.dto';
import { IVenue } from './venue.dto';

export interface ICheckoutShort {
  id: number;
  name: string;
  slug: string;
  description: string;
  backgroundImageUrl?: string;
  heroImage?: string;
}

export interface ICheckout extends ICheckoutShort {
  checkoutCategories: ICheckoutCategoryWithProducts[];
  venue?: IVenue;
}
