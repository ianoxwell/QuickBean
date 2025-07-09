import { ERole } from '@models/base.dto';
import { IProduct } from '@models/products.dto';
import { IUserSummary } from '@models/user.dto';
import { IVenue, IVenueShort, IVenueWithProducts } from '@models/venue.dto';
import { Venue } from './Venue.entity';

export function userHasAccessToVenue(user: IUserSummary, venue: IVenue, roles: ERole[]): boolean {
  if (!user || !venue) {
    return false;
  }

  if (!user.venues.map((v) => v.id).includes(venue.id)) {
    return false; // User does not have access to this venue
  }

  // If the user has no roles, they do not have access
  if (!user.roles || user.roles.length === 0) {
    return false;
  }

  // Check if the user is an admin
  if (user.roles.includes(ERole.ADMIN)) {
    return true;
  }

  // If the user has any of the specified roles, they have access
  return roles.find((role) => user.roles.includes(role)) ? true : false;
}

/** Map the Venue entity to IVenue */
export function mapVenueToIVenue(venue: Venue): IVenue {
  return {
    ...mapVenueToIVenueShort(venue),
    isActive: venue.isActive,
    countryId: venue.countryId,
    openingHours: venue.openingHours,
    address: venue.address,
    city: venue.city,
    state: venue.state,
    postcode: venue.postcode,
    legalBusinessName: venue.legalBusinessName,
    legalBusinessNumber: venue.legalBusinessNumber,
    timezone: venue.timezone,
    privacyPolicy: venue.privacyPolicy,
    websiteUrl: venue.websiteUrl
  };
}

/** Map the Venue to IVenueShort */
export function mapVenueToIVenueShort(venue: Venue): IVenueShort {
  return {
    id: venue.id,
    name: venue.name,
    slug: venue.slug,
    logoImage: venue.logoImage,
    publicPhone: venue.publicPhone
  };
}

export function mapVenueToIVenueProducts(venue: Venue, products: IProduct[]): IVenueWithProducts {
  return {
    ...mapVenueToIVenue(venue),
    products,
    checkoutCategories: [] // Assuming this will be populated elsewhere
  };
}
