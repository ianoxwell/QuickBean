import { ProductType } from '@models/base.dto';

const products = [
  {
    name: 'Flat White',
    description: 'Espresso with steamed milk',
    baseCost: 4.0,
    isActive: true,
    productType: ProductType.HOT_DRINK
  },
  {
    name: 'Cold Brew',
    description: 'Slow steeped cold coffee',
    baseCost: 5.0,
    isActive: true,
    productType: ProductType.COLD_DRINK
  }
];

export default products;
