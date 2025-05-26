import { EBookingStatus } from '@models/base.dto';
import { ISelectedModifierOption } from './modifier.dto';
import { IVenueShort } from './venue.dto';
import { IUserProfile } from './user.dto';

export interface IOrder {
  id: number;
  orderDate: Date;
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
}

export interface IOrderItem {
  id: number;
  productId: number;
  quantity: number;
  price: number;
  selectedModifiers?: ISelectedModifierOption[];
}
