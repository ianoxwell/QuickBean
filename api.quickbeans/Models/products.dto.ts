import { EProductType } from '@models/base.dto';
import { IModifier } from './modifier.dto';

export interface IProduct {
  id: number;
  name: string;
  description: string;
  baseCost: number;
  imageUrl?: string;
  isActive: boolean;
  productType: EProductType;
  modifiers: IModifier[];
}
