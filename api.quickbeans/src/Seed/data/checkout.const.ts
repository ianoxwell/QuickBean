import venues from './venues.const';
import products from './products.const';
import { EProductType } from '@models/base.dto';

const CCheckouts = [
  {
    name: 'Downtown Coffee Bar Checkout',
    slug: 'dcb-checkout',
    description: 'Order your favorite drinks at Downtown Coffee Bar.',
    backgroundImageUrl: 'https://downtowncoffee.example.com/bg.jpg',
    heroImage: 'https://downtowncoffee.example.com/hero.jpg',
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
