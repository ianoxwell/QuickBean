import { IProduct } from './products.dto';

export interface IVenueShort {
  id: number;
  name: string;
  slug: string;
  websiteUrl: string;
  publicPhone?: string;
  logoImage?: string;
}

export interface IVenue extends IVenueShort {
  isActive: boolean;
  countryId: string;
  openingHours: { day: number; open: number; close: number }[];
  address: string;
  city: string;
  state: string;
  postcode: string;
  legalBusinessName: string;
  legalBusinessNumber: string;
  timezone: string;
  privacyPolicy: string;
}

export interface IVenueWithProducts extends IVenue {
  products: IProduct[];
  checkoutCategories: { id: number; name: string; order: number; checkoutIds: number[] }[];
}
