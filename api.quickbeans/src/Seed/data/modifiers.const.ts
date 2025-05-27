import { ModifierOption } from '@controllers/modifier/Modifier.entity';
import venues from './venues.const';

const modifiers = [
  {
    name: 'Size',
    venue: venues[0],
    options: [
      { label: 'Small', priceAdjustment: 0 },
      { label: 'Medium', priceAdjustment: 0.5 },
      { label: 'Large', priceAdjustment: 1.0 }
    ] as ModifierOption[]
  },
  {
    name: 'Milk',
    venue: venues[0],
    options: [
      { label: 'Whole', priceAdjustment: 0 },
      { label: 'Almond', priceAdjustment: 0.5 },
      { label: 'Soy', priceAdjustment: 0.5 }
    ] as ModifierOption[]
  },
  {
    name: 'Ice Level',
    venue: venues[0],
    options: [
      { label: 'Regular Ice', priceAdjustment: 0 },
      { label: 'Less Ice', priceAdjustment: 0 },
      { label: 'No Ice', priceAdjustment: 0 }
    ] as ModifierOption[]
  }
];

export default modifiers;
