import { User } from '@controllers/user/User.entity';
import { Role } from '@models/base.dto';
import * as bcrypt from 'bcrypt';

const hash = (password: string) => bcrypt.hashSync(password, 10);

const users: Partial<User>[] = [
  {
    name: 'Alice Admin',
    email: 'admin@coffee.com',
    phone: '0400000001',
    passwordHash: hash('admin123'),
    isActive: true,
    loginProvider: 'local',
    roles: [Role.ADMIN],
    venues: []
  },
  {
    name: 'Bob Barista',
    email: 'bob@coffee.com',
    phone: '0400000002',
    passwordHash: hash('kitchen123'),
    isActive: true,
    loginProvider: 'local',
    roles: [Role.KITCHEN],
    venues: []
  }
];

export default users;
