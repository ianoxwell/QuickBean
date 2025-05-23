import { Modifier } from '@controllers/modifier/Modifier.entity';
import { Product } from '@controllers/product/Product.entity';
import { User } from '@controllers/user/User.entity';
import { Venue } from '@controllers/venue/Venue.entity';
import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';

import modifiers from './data/modifiers.const';
import products from './data/products.const';
import users from './data/users.const';
import venues from './data/venues.const';
import { SeederModule } from './seeder.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeederModule);
  const dataSource = app.get(DataSource);

  console.log('Seeding database...');

  // Seed Venues
  const venueRepo = dataSource.getRepository(Venue);
  await venueRepo.save(venues);

  // Seed Users
  const userRepo = dataSource.getRepository(User);
  await userRepo.save(users);

  // Seed Modifiers
  const modifierRepo = dataSource.getRepository(Modifier);
  await modifierRepo.save(modifiers);

  // Seed Products
  const productRepo = dataSource.getRepository(Product);
  await productRepo.save(products);

  console.log('✅ Seeding complete');
  await app.close();
}

bootstrap();
