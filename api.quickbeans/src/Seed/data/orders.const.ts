import { Order } from '@controllers/order/Order.entity';
import { OrderItem } from '@controllers/order/OrderItem.entity';
import { Product } from '@controllers/product/Product.entity';
import { Venue } from '@controllers/venue/Venue.entity';
import { EBookingStatus } from '@models/base.dto';
import products from './products.const';
import users from './users.const';
import venues from './venues.const';

// Helper to get a random int between min and max (inclusive)
function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper to get a random date 2-4 weeks in the future
function randomFutureDate() {
  const now = new Date();
  const daysToAdd = randInt(14, 28);
  now.setDate(now.getDate() + daysToAdd);
  now.setHours(randInt(7, 16), randInt(0, 59), 0, 0);
  return new Date(now);
}

// Helper to pick random products and quantities
function randomOrderItems() {
  const numItems = randInt(1, 3);
  const items: Partial<OrderItem>[] = [];
  const usedIndexes = new Set<number>();
  Array.from({ length: numItems }).forEach(() => {
    let idx: number;
    do {
      idx = randInt(0, products.length - 1);
    } while (usedIndexes.has(idx));
    usedIndexes.add(idx);
    const product = products[idx];
    items.push({
      product: product as Product,
      quantity: randInt(1, 4),
      price: product.baseCost
    });
  });
  return items;
}

const orders: Partial<Order>[] = Array.from({ length: 4 }).map(() => {
  const patron = users[2]; // Patty Patron
  const venue = venues[0];
  const orderItems = randomOrderItems();
  const grandTotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return {
    orderDate: randomFutureDate(),
    receiptNumber: `R${randInt(10000, 99999)}`,
    amountPaid: grandTotal,
    grandTotal,
    discount: 0,
    comments: '',
    bookingStatus: EBookingStatus.CONFIRMED,
    items: orderItems as OrderItem[],
    venue: venue as Venue,
    patron
  };
});

export default orders;
