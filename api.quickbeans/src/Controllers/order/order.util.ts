import { IOrder, IOrderItem, IShortOrder } from '@models/order.dto';
import { Order } from './Order.entity';
import { OrderItem } from './OrderItem.entity';

export const mapOrderToIShortOrder = (order: Order): IShortOrder => {
  return {
    id: order.id,
    orderDate: order.orderDate,
    receiptNumber: order.receiptNumber,
    amountPaid: order.amountPaid,
    grandTotal: order.grandTotal,
    discount: order.discount,
    comments: order.comments,
    bookingStatus: order.orderStatus
  };
};

export const mapOrderToIOrder = (order: Order): IOrder => {
  return {
    ...mapOrderToIShortOrder(order),
    items: order.items.map((item) => mapOrderItemToIOrderItem(item)),
    venueId: order.venue?.id,
    venue: order.venue ? { id: order.venue.id, name: order.venue.name, slug: order.venue.slug } : undefined,
    patronId: order.patron?.id,
    patron: order.patron ? { id: order.patron.id, name: order.patron.name, email: order.patron.email } : undefined,
    checkoutId: order.checkout?.id,
    checkout: order.checkout
      ? {
          id: order.checkout.id,
          name: order.checkout.name,
          slug: order.checkout.slug,
          checkoutUrl: `${order.venue.slug}/${order.checkout.slug}`
        }
      : undefined
  };
};

export const mapOrderItemToIOrderItem = (item: OrderItem): IOrderItem => {
  return {
    id: item.id,
    productId: item.product.id,
    product: item.product,
    quantity: item.quantity,
    price: item.price,
    selectedModifiers: item.selectedModifiers // Assuming this is already in the correct format
  };
};
