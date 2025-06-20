import { EProductType } from '@models/base.dto';
import { IModifier } from './modifier.dto';

export interface IProductShort {
  id?: number;
  name: string;
  description: string;
  productType: EProductType;
}

export interface IProduct extends IProductShort {
  baseCost: number;
  imageUrl?: string;
  modifiers: IModifier[];
}
