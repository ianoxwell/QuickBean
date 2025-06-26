import { IProductShort } from './products.dto';

export interface IModifier {
  id: number;
  name: string;
  isRequired: boolean; // indicates if this modifier must be selected for the product
  options: IModifierOption[];
  products?: IProductShort[]; // Optional, if you want to include products associated with this modifier
}

export interface IProductModifier extends IModifier {
  order: number; // The order of this modifier for the product
  options: IProductModifierOption[]; // Options specific to this product modifier
}

export interface IModifierOption {
  id: number;
  label: string;
  description?: string;
  priceAdjustment?: number;
  percentAdjustment?: number; // relates directly to the base cost of the product
  isDefault: boolean;
}

export interface IProductModifierOption extends IModifierOption {
  priceAdjustment: number;
}

export interface ISelectedModifierOption {
  modifierId: number;
  optionId: number;
  label: string;
}
