export interface IModifier {
  id: number;
  name: string;
  // Add other fields as needed
  options: IModifierOption[];
}

export interface IModifierOption {
  id: number;
  label: string;
  description?: string;
  priceAdjustment?: number;
  percentAdjustment?: number;
}

export interface ISelectedModifierOption {
  modifierId: number;
  optionId: number;
  label: string;
  priceAdjustment?: number;
  percentAdjustment?: number;
}
