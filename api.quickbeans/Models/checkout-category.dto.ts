import { EProductType } from './base.dto';
import { IProduct } from './products.dto';

export interface ICheckoutCategory {
  id: number;
  name: string;
  order: number;
  productType: EProductType;
  checkoutIds?: number[];
}

export interface ICheckoutCategoryWithProducts extends ICheckoutCategory {
  products: IProduct[];
}
