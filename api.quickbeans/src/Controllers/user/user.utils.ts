import { mapVenueToIVenueShort } from '@controllers/venue/venue.utils';
import { IUserSummary } from '@models/user.dto';
import { User } from './User.entity';

export function mapUserToSummary(user: User): IUserSummary {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    isActive: user.isActive,
    failedLoginAttempt: user.failedLoginAttempt,
    lastFailedLoginAttempt: user.lastFailedLoginAttempt,
    timesLoggedIn: user.timesLoggedIn,
    firstLogin: user.firstLogin,
    lastLogin: user.lastLogin,
    roles: user.roles,
    venues: user.venues?.map((venue) => mapVenueToIVenueShort(venue)) || []
  };
}
