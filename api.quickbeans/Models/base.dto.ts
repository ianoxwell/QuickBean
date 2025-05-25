export class IBaseDto {
  id?: number;
  updatedAt?: Date;
  createdAt?: Date;
}

export enum EOrder {
  ASC = 'ASC',
  DESC = 'DESC'
}

export interface IPagedResult<T> {
  results: T[];
  meta: IPagedMeta;
}

export interface IPagedMeta {
  readonly page: number;
  readonly take: number;
  readonly itemCount: number;
  readonly pageCount: number;
  readonly hasPreviousPage: boolean;
  readonly hasNextPage: boolean;
}

export enum ERole {
  ADMIN = 'admin',
  KITCHEN = 'kitchen',
  FRONT_OF_HOUSE = 'front_of_house',
  PATRON = 'patron'
}

export enum EProductType {
  HOT_DRINK = 'hot_drink',
  TEA_BREWED = 'tea_brewed',
  COLD_DRINK = 'cold_drink',
  FOOD = 'food'
}

export enum EBookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded'
}

export type TLoginProvider = 'local' | 'google' | 'facebook' | 'apple';
