import { ProductType } from '@models/base.dto';
import venues from './venues.const';
import modifiers from './modifiers.const';

const products = [
  {
    name: 'Flat White',
    description: 'Espresso with steamed milk',
    baseCost: 4.0,
    isActive: true,
    productType: ProductType.HOT_DRINK,
    modifiers: [modifiers[0], modifiers[1]],
    venue: venues[0]
  },
  {
    name: 'Cold Brew',
    description: 'Slow steeped cold coffee',
    baseCost: 5.0,
    isActive: true,
    productType: ProductType.COLD_DRINK,
    modifiers: [modifiers[0], modifiers[1]],
    venue: venues[0]
  }
];

export default products;
