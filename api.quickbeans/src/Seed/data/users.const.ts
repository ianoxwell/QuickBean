import { User } from '@controllers/user/User.entity';
import { Venue } from '@controllers/venue/Venue.entity';
import { Role } from '@models/base.dto';
import venues from './venues.const';

const users: User[] = [
  {
    name: 'Alice Admin',
    email: 'admin@coffee.com',
    phone: '0400000001',
    passwordHash: 'admin123', // This gets hashed in the seed script
    isActive: true,
    verified: new Date(),
    loginProvider: 'local',
    roles: [Role.ADMIN],
    timesLoggedIn: 0,
    venues: venues as Venue[]
  },
  {
    name: 'Bob Barista',
    email: 'bob@coffee.com',
    phone: '0400000002',
    passwordHash: 'kitchen123',
    isActive: true,
    verified: new Date(),
    loginProvider: 'local',
    roles: [Role.KITCHEN],
    venues: venues as Venue[],
    timesLoggedIn: 0
  }
];

export default users;
