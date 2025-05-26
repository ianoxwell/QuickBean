import { IProduct } from './products.dto';

export interface ICheckoutCategory {
  id: number;
  name: string;
  order: number;
  checkoutIds?: number[];
}

export interface ICheckoutCategoryWithProducts extends ICheckoutCategory {
  products: IProduct[];
}
