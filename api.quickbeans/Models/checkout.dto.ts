import { ICheckoutCategoryWithProducts } from './checkout-category.dto';
import { IVenue } from './venue.dto';

export interface ICheckoutShort {
  id: number;
  name: string;
  slug: string;
  backgroundImageUrl?: string;
  heroImage?: string;
}

export interface ICheckout extends ICheckoutShort {
  description: string;
  categories: ICheckoutCategoryWithProducts[];
  venue?: IVenue;
}
