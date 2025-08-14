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
  FOOD = 'food',
  CHICKEN = 'chicken',
  BEEF = 'beef',
  LAMB = 'lamb',
  PORK = 'pork'
}

export enum EOrderStatus {
  PENDING = 'pending', // order has been placed - grey
  PREPARING = 'preparing', // order is being prepared - yellow
  READY = 'ready', // order is ready for pickup - green
  COMPLETED = 'completed', // order has been picked up or delivered - blue
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded'
}

export type TLoginProvider = 'local' | 'admin' | 'google' | 'facebook' | 'apple';
