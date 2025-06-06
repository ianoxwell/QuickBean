import { EBookingStatus } from '@models/base.dto';
import { ICheckoutShort } from './checkout.dto';
import { ISelectedModifierOption } from './modifier.dto';
import { IProduct } from './products.dto';
import { IUserProfile } from './user.dto';
import { IVenueShort } from './venue.dto';

export interface IOrder {
  id: number;
  orderDate: Date | string;
  receiptNumber: string;
  amountPaid: number;
  grandTotal: number;
  discount?: number;
  comments?: string;
  bookingStatus: EBookingStatus;
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
  product: IProduct;
  quantity: number;
  price: number;
  selectedModifiers?: ISelectedModifierOption[];
}
