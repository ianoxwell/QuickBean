import { EOrderStatus } from '@models/base.dto';
import { ICheckoutShort } from './checkout.dto';
import { ISelectedModifierOption } from './modifier.dto';
import { IProductShort } from './products.dto';
import { IUserProfile } from './user.dto';
import { IVenueShort } from './venue.dto';

export interface IShortOrder {
  id?: number;
  orderDate?: Date | string;
  receiptNumber?: string;
  amountPaid: number;
  grandTotal: number;
  discount?: number;
  comments?: string;
  bookingStatus: EOrderStatus;
}

export interface IOrder extends IShortOrder {
  items: IOrderItem[];
  venueId?: number;
  venue?: IVenueShort;
  patronId?: number;
  patron?: IUserProfile;
  checkoutId?: number;
  checkout?: ICheckoutShort;
}

export interface IOrderItem {
  id: number;
  // This can be used for tracking or referencing the item in a more user-friendly way
  uniqueId?: string; // Optional unique identifier for the order item
  productId: number;
  product: IProductShort;
  quantity: number;
  price: number;
  selectedModifiers?: ISelectedModifierOption[];
}

export interface IOrderStatusUpdate {
  receiptNumber: string;
  status: EOrderStatus;
}

export interface IOrderSubscription {
  receiptNumber: string;
  userId: number;
  venueId: number;
}

export interface IKitchenOrderSubscription {
  venueId: number;
  userId: number;
}
