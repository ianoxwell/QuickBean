import { IProduct } from './products.dto';

export interface IVenueShort {
  id: number;
  name: string;
  slug: string;
  publicPhone?: string;
  logoImage?: string;
}

export interface IVenueOpeningHours {
  day: number;
  open: number;
  close: number;
}

export interface IVenue extends IVenueShort {
  websiteUrl: string;
  isActive: boolean;
  countryId: string;
  openingHours: IVenueOpeningHours[];
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
