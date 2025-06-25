import { Checkout } from '@controllers/checkout/Checkout.entity';
import { CheckoutCategory } from '@controllers/checkout/CheckoutCategory.entity';
import { Modifier } from '@controllers/modifier/Modifier.entity';
import { Order } from '@controllers/order/Order.entity';
import { OrderItem } from '@controllers/order/OrderItem.entity';
import { Product } from '@controllers/product/Product.entity';
import { User } from '@controllers/user/User.entity';
import { Venue } from '@controllers/venue/Venue.entity';
import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import CCheckouts from './data/checkout.const';
import modifiers from './data/modifiers.const';
import orders from './data/orders.const';
import products from './data/products.const';
import users from './data/users.const';
import venues from './data/venues.const';
import { SeederModule } from './seeder.module';
import { ProductModifier } from '@controllers/product/ProductModifierJoin.entity';
import productModifiers from './data/productModifiers.const';

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
  console.log('Modifiers seeded');

  // Seed Products
  const productRepo = dataSource.getRepository(Product);
  await Promise.all(
    products.map(async (product) => {
      const existingProduct = await productRepo.findOneBy({ name: product.name, venue: { name: product.venue?.name } });
      if (existingProduct) {
        console.log(`Product ${product.name} already exists, skipping...`);
        return existingProduct;
      }

      // Assign the found venue to the product
      product.venue = venue;
      // product.modifiers =
      //   product.modifiers?.map((mod) => {
      //     const modifier = modifiersList.find((m) => m.name === mod.name);
      //     if (!modifier) {
      //       throw new Error(`Modifier not found: ${mod.name}`);
      //     }

      //     return modifier;
      //   }) || [];

      // Save the product
      return await productRepo.save(product);
    })
  );
  console.log('Products seeded');

  // Seed Product Modifiers
  const productModifierRepo = dataSource.getRepository(ProductModifier);
  const modifiersList = await modifierRepo.find();
  const productsList = await productRepo.findBy({ venue: { id: venue.id }, isActive: true });
  await Promise.all(
    productModifiers.map(async (pm) => {
      const existingProductModifier = await productModifierRepo.findOneBy({
        product: { name: pm.product.name },
        modifier: { name: pm.modifier.name }
      });
      if (existingProductModifier) {
        if (pm.order === existingProductModifier.order) {
          console.log(`Product Modifier for product ${pm.product.name} and modifier ${pm.modifier.name} already exists, skipping...`);
          return existingProductModifier;
        }

        existingProductModifier.order = pm.order; // Update the order if it differs
        console.log(`Updating order for Product Modifier: ${pm.product.name} - ${pm.modifier.name}`);
        return await productModifierRepo.save(existingProductModifier);
      }

      pm.product = productsList.find((p) => p.name === pm.product.name);
      pm.modifier = modifiersList.find((m) => m.name === pm.modifier.name);
      if (!pm.product || !pm.modifier) {
        throw new Error(`Product or Modifier not found for Product Modifier: ${JSON.stringify(pm)}`);
      }

      // If the product modifier does not exist, create a new one
      const newProductModifier = productModifierRepo.create(pm);
      return await productModifierRepo.save(newProductModifier);
    })
  );

  // Seed checkouts
  const checkoutRepo = dataSource.getRepository(Checkout);
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

  // Seed Orders
  const orderRepo = dataSource.getRepository(Order);
  const orderItemRepo = dataSource.getRepository(OrderItem);
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

      const checkout = await checkoutRepo.findOneBy({ slug: order.checkout?.slug, venue: { id: venue.id }, isActive: true });
      if (!checkout) {
        throw new Error(`Checkout not found for order: ${order.venue.slug}`);
      }

      // Create order items with products
      const orderItems = Promise.all(
        order.items.map(async (item) => {
          const product = await productRepo.findOneBy({ name: item.product.name, venue: { name: item.product.venue?.name } });
          if (!product) {
            throw new Error(`Product not found for order item: ${item.product.name}`);
          }

          product.venue = venue; // Ensure the product is associated with the venue
          return orderItemRepo.create({
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
        checkout,
        items: await orderItems
      });
      const savedOrder = await orderRepo.save(newOrder);
      console.log(`Order ${savedOrder.receiptNumber} created for venue ${venue.name} and patron ${patron.email}`);
      return savedOrder;
    })
  );

  console.log('✅ Seeding complete');
  await app.close();
}

bootstrap();
