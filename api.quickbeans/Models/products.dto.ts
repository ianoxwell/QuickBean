import { EProductType } from '@models/base.dto';
import { IProductModifier } from './modifier.dto';

export interface IProductShort {
  id?: number;
  name: string;
  description: string;
  productType: EProductType;
  imageUrl?: string;
}

export interface IProduct extends IProductShort {
  baseCost: number;
  modifiers: IProductModifier[];
}
