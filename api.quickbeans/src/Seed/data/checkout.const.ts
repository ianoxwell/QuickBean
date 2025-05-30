import venues from './venues.const';
import products from './products.const';
import { EProductType } from '@models/base.dto';

const CCheckouts = [
  {
    name: 'Downtown Coffee Bar Checkout',
    slug: 'dcb-checkout',
    description: 'Coffee downtown',
    heroImageTextColor: '#FFFFFF',
    heroImage: 'https://raw.githubusercontent.com/ianoxwell/QuickBean/main/assets/patrick-tomasso-GXXYkSwndP4-unsplash.jpg',
    venue: venues[0],
    categories: [
      {
        name: 'Hot Drinks',
        productType: EProductType.HOT_DRINK,
        order: 1,
        products: products.filter((p) => p.productType === EProductType.HOT_DRINK)
      },
      {
        name: 'Cold Drinks',
        productType: EProductType.COLD_DRINK,
        order: 2,
        products: products.filter((p) => p.productType === EProductType.COLD_DRINK)
      }
    ]
  }
];

export default CCheckouts;
