import { User } from '@controllers/user/User.entity';
import { Venue } from '@controllers/venue/Venue.entity';
import { ERole } from '@models/base.dto';
import venues from './venues.const';

const users: User[] = [
  {
    name: 'Alice Admin',
    email: 'admin@coffee.com',
    isActive: true,
    loginProvider: 'local',
    roles: [ERole.ADMIN],
    timesLoggedIn: 0,
    venues: venues as Venue[]
  },
  {
    name: 'Bob Barista',
    email: 'bob@coffee.com',
    isActive: true,
    loginProvider: 'local',
    roles: [ERole.KITCHEN],
    venues: venues as Venue[],
    timesLoggedIn: 0
  },
  {
    name: null, // No name for this user
    email: 'patron@coffee.com',
    isActive: true,
    loginProvider: 'local',
    roles: [ERole.PATRON],
    venues: venues as Venue[],
    timesLoggedIn: 0
  },
  {
    name: 'Frank FrontOfHouse',
    email: 'front@coffee.com',
    isActive: true,
    loginProvider: 'local',
    roles: [ERole.FRONT_OF_HOUSE],
    venues: venues as Venue[],
    timesLoggedIn: 0
  }
];

export default users;
