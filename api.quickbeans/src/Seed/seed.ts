import { Modifier } from '@controllers/modifier/Modifier.entity';
import { Product } from '@controllers/product/Product.entity';
import { User } from '@controllers/user/User.entity';
import { Venue } from '@controllers/venue/Venue.entity';
import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

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
  await Promise.all(
    venues.map(async (venue) => {
      const existingVenue = await venueRepo.findOneBy({ name: venue.name });
      if (existingVenue) {
        // If the venue already exists, update it with the new data
        const updatedVenue = venueRepo.merge(existingVenue, venue);
        console.log(`Venue ${venue.name} already exists, updating...`);
        return await venueRepo.save(updatedVenue);
      }
      // If the venue does not exist, create a new one

      console.log(`Creating venue: ${venue.name}`);
      return await venueRepo.save(venue);
    })
  );

  console.log('Venues seeded');

  // Seed Users
  const userRepo = dataSource.getRepository(User);
  await Promise.all(
    users.map(async (user) => {
      const existingUser = await userRepo.findOneBy({ email: user.email });
      if (existingUser) {
        console.log(`User ${user.email} already exists, skipping... ${existingUser.name} ${existingUser.email}`);
        return existingUser;
      }

      const venue = user.venues?.length ? await venueRepo.findOneBy({ name: user.venues[0].name }) : await venueRepo.findOne({});
      if (!venue) {
        throw new Error(`Venue not found: ${JSON.stringify(user.venues)}`);
      }
      user.passwordHash = await bcrypt.hash(user.passwordHash || 'password', 10); // Default password if not provided
      user.venues = [venue]; // Assign the venue to the user

      return await userRepo.save(user);
    })
  );
  console.log('Users seeded');

  // Seed Modifiers
  const modifierRepo = dataSource.getRepository(Modifier);
  await Promise.all(
    modifiers.map(async (modifier) => {
      const existingModifier = await modifierRepo.findOneBy({ name: modifier.name, venue: { name: modifier.venue?.name } });
      if (existingModifier) {
        console.log(`Modifier ${modifier.name} already exists, skipping...`);
        return existingModifier;
      }

      // Find the venue by name
      const venue: Venue | null = await venueRepo.findOneBy({ name: modifier.venue?.name });
      if (!venue) {
        throw new Error(`Venue not found: ${modifier.venue?.name}`);
      }

      // Assign the found venue to the modifier
      modifier.venue = venue;

      // Save the modifier
      return await modifierRepo.save(modifier);
    })
  );

  // Seed Products
  const productRepo = dataSource.getRepository(Product);
  await Promise.all(
    products.map(async (product) => {
      const existingProduct = await productRepo.findOneBy({ name: product.name, venue: { name: product.venue?.name } });
      if (existingProduct) {
        console.log(`Product ${product.name} already exists, skipping...`);
        return existingProduct;
      }

      // Find the venue by name
      const venue = await venueRepo.findOneBy({ name: product.venue?.name });
      if (!venue) {
        throw new Error(`Venue not found: ${product.venue?.name}`);
      }

      // Assign the found venue to the product
      product.venue = venue;

      // Save the product
      return await productRepo.save(product);
    })
  );

  console.log('✅ Seeding complete');
  await app.close();
}

bootstrap();
