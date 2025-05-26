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
