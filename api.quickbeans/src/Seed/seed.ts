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
import { Order } from '@controllers/order/Order.entity';
import orders from './data/orders.const';
import { OrderItem } from '@controllers/order/OrderItem.entity';
import { Checkout } from '@controllers/checkout/Checkout.entity';
import CCheckouts from './data/checkout.const';
import { CheckoutCategory } from '@controllers/checkout/CheckoutCategory.entity';

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
  const venue = await venueRepo.findOneBy({ name: venues[0].name });

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
  const modifiersList = await modifierRepo.find();
  await Promise.all(
    products.map(async (product) => {
      const existingProduct = await productRepo.findOneBy({ name: product.name, venue: { name: product.venue?.name } });
      if (existingProduct) {
        console.log(`Product ${product.name} already exists, skipping...`);
        return existingProduct;
      }

      // Assign the found venue to the product
      product.venue = venue;
      product.modifiers =
        product.modifiers?.map((mod) => {
          const modifier = modifiersList.find((m) => m.name === mod.name);
          if (!modifier) {
            throw new Error(`Modifier not found: ${mod.name}`);
          }

          return modifier;
        }) || [];

      // Save the product
      return await productRepo.save(product);
    })
  );
  console.log('Products seeded');

  // Seed Orders
  const orderRepo = dataSource.getRepository(Order);
  await Promise.all(
    orders.map(async (order) => {
      const venue = await venueRepo.findOneBy({ name: order.venue.name });
      if (!venue) {
        throw new Error(`Venue not found for order: ${order.venue.name}`);
      }

      const patron = await userRepo.findOneBy({ email: order.patron.email });
      if (!patron) {
        throw new Error(`Patron not found for order: ${order.patron.email}`);
      }

      // Create order items with products
      const orderItems = Promise.all(
        order.items.map(async (item) => {
          const product = await productRepo.findOneBy({ name: item.product.name, venue: { name: item.product.venue?.name } });
          if (!product) {
            throw new Error(`Product not found for order item: ${item.product.name}`);
          }

          product.venue = venue; // Ensure the product is associated with the venue
          return orderRepo.manager.create(OrderItem, {
            ...item,
            product,
            order: null // Set later when saving the order
          });
        })
      );
      const newOrder = orderRepo.create({
        ...order,
        venue,
        patron,
        items: await orderItems
      });
      const savedOrder = await orderRepo.save(newOrder);
      console.log(`Order ${savedOrder.receiptNumber} created for venue ${venue.name} and patron ${patron.email}`);
      return savedOrder;
    })
  );

  // Seed checkouts
  const checkoutRepo = dataSource.getRepository(Checkout);
  const productsList = await productRepo.findBy({ venue: { id: venue.id }, isActive: true });
  console.log('Products list fetched for checkouts', productsList);

  const checkoutCategoryRepo = dataSource.getRepository(CheckoutCategory);
  const checkoutCategoriesList = await checkoutCategoryRepo.find();
  await Promise.all(
    CCheckouts.map(async (checkout) => {
      const existingCheckout = await checkoutRepo.findOneBy({ slug: checkout.slug });
      if (existingCheckout) {
        console.log(`Checkout ${checkout.name} already exists, skipping...`);
        return existingCheckout;
      }

      // Assign the venue to the checkout
      checkout.venue = venue;

      // Prepare categories array
      const categoriesToAssign: CheckoutCategory[] = [];
      for (const category of checkout.categories) {
        let checkoutCategory = checkoutCategoriesList.find((c) => c.name === category.name && c.productType === category.productType);

        if (!checkoutCategory) {
          // If the category does not exist, create a new one
          checkoutCategory = checkoutCategoryRepo.create({
            name: category.name,
            productType: category.productType,
            order: category.order,
            isActive: true,
            products: category.products.map((product) => {
              const existingProduct = productsList.find((p) => p.name === product.name);
              if (!existingProduct) {
                throw new Error(`Product not found for checkout category: ${category.name}, with product name: ${product.name}`);
              }

              return existingProduct;
            })
          });

          checkoutCategory = await checkoutCategoryRepo.save(checkoutCategory);
          console.log('Created new checkout category', checkoutCategory.name, 'for checkout', checkout.name);
        } else {
          checkoutCategory.products = category.products.map((product) => {
            const existingProduct = productsList.find((p) => p.name === product.name);

            if (!existingProduct) {
              throw new Error(`Product not found for checkout category: ${product.name}`);
            }
            return existingProduct;
          });

          checkoutCategory = await checkoutCategoryRepo.save(checkoutCategory);
        }

        categoriesToAssign.push(checkoutCategory);
      }

      checkout.categories = categoriesToAssign;
      console.log(`Creating checkout: ${checkout.name}`, checkout);

      return await checkoutRepo.save(checkout);
    })
  );
  console.log('Checkouts seeded');

  console.log('✅ Seeding complete');
  await app.close();
}

bootstrap();
