import { Product } from '@controllers/product/Product.entity';
import { Venue } from '@controllers/venue/Venue.entity';
import { EProductType } from '@models/base.dto';
import venues from './venues.const';

const products: Product[] = [
  {
    name: 'Flat White',
    description: 'Espresso with steamed milk',
    baseCost: 4.0,
    isActive: true,
    imageUrl: 'https://raw.githubusercontent.com/ianoxwell/QuickBean/main/assets/flat-white.jpg',
    productType: EProductType.HOT_DRINK,
    venue: venues[0] as Venue,
    productModifiers: []
  },
  {
    name: 'Cold Brew',
    description: 'Slow steeped cold coffee',
    baseCost: 5.0,
    isActive: true,
    imageUrl: 'https://raw.githubusercontent.com/ianoxwell/QuickBean/main/assets/cold-brew.jpg',
    productType: EProductType.COLD_DRINK,
    productModifiers: [],
    venue: venues[0] as Venue
  },
  {
    name: 'Long Black',
    description: 'Double espresso poured over hot water',
    baseCost: 4.0,
    isActive: true,
    imageUrl: 'https://raw.githubusercontent.com/ianoxwell/QuickBean/main/assets/long-black.jpg',
    productType: EProductType.HOT_DRINK,
    productModifiers: [],
    venue: venues[0] as Venue
  },
  {
    name: 'Iced Latte',
    description: 'Espresso with cold milk and ice',
    baseCost: 5.5,
    isActive: true,
    imageUrl: 'https://raw.githubusercontent.com/ianoxwell/QuickBean/main/assets/iced-latte.jpg',
    productType: EProductType.COLD_DRINK,
    productModifiers: [],
    venue: venues[0] as Venue
  }
];

export default products;
