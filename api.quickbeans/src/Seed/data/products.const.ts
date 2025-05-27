import { EProductType } from '@models/base.dto';
import venues from './venues.const';
import modifiers from './modifiers.const';

const products = [
  {
    name: 'Flat White',
    description: 'Espresso with steamed milk',
    baseCost: 4.0,
    isActive: true,
    productType: EProductType.HOT_DRINK,
    modifiers: [modifiers[0], modifiers[1]],
    venue: venues[0]
  },
  {
    name: 'Cold Brew',
    description: 'Slow steeped cold coffee',
    baseCost: 5.0,
    isActive: true,
    productType: EProductType.COLD_DRINK,
    modifiers: [modifiers[0], modifiers[1]],
    venue: venues[0]
  },
  {
    name: 'Long Black',
    description: 'Double espresso poured over hot water',
    baseCost: 4.0,
    isActive: true,
    productType: EProductType.HOT_DRINK,
    modifiers: [modifiers[0]],
    venue: venues[0]
  },
  {
    name: 'Iced Latte',
    description: 'Espresso with cold milk and ice',
    baseCost: 5.5,
    isActive: true,
    productType: EProductType.COLD_DRINK,
    modifiers: [modifiers[0], modifiers[1], modifiers[2]],
    venue: venues[0]
  }
];

export default products;
