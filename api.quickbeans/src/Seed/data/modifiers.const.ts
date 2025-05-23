import { Modifier, ModifierOption } from '@controllers/modifier/Modifier.entity';

const modifiers: Partial<Modifier>[] = [
  {
    name: 'Size',
    options: [
      { label: 'Small', priceAdjustment: 0 },
      { label: 'Medium', priceAdjustment: 0.5 },
      { label: 'Large', priceAdjustment: 1.0 }
    ] as ModifierOption[]
  },
  {
    name: 'Milk',
    options: [
      { label: 'Whole', priceAdjustment: 0 },
      { label: 'Almond', priceAdjustment: 0.5 },
      { label: 'Soy', priceAdjustment: 0.5 }
    ] as ModifierOption[]
  }
];

export default modifiers;
