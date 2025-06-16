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
    name: 'Frank FrontOfHouse',
    email: 'front@coffee.com',
    isActive: true,
    loginProvider: 'local',
    roles: [ERole.FRONT_OF_HOUSE],
    venues: venues as Venue[],
    timesLoggedIn: 0
  },
  // First patron
  {
    name: 'Patty Patron',
    email: 'patron@coffee.com',
    isActive: true,
    loginProvider: 'local',
    roles: [ERole.PATRON],
    venues: venues as Venue[],
    timesLoggedIn: 0
  },
  // second patron
  {
    name: 'Professor Patron',
    email: 'professor@coffee.com',
    isActive: true,
    loginProvider: 'local',
    roles: [ERole.PATRON],
    venues: venues as Venue[],
    timesLoggedIn: 0
  },
  // third patron
  {
    name: 'Sally Student',
    email: 'sally@coffee.com',
    isActive: true,
    loginProvider: 'local',
    roles: [ERole.PATRON],
    venues: venues as Venue[],
    timesLoggedIn: 0
  }
];

export default users;
