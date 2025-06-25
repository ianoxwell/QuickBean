import modifiers from './modifiers.const';
import products from './products.const';

const productModifiers = [
  {
    product: products[0], // flat white
    modifier: modifiers[0],
    order: 0
  },
  {
    product: products[0], // flat white
    modifier: modifiers[1],
    order: 1
  },
  {
    product: products[1], // cold brew
    modifier: modifiers[0],
    order: 0
  },
  {
    product: products[1], // cold brew
    modifier: modifiers[1],
    order: 1
  },
  {
    product: products[2], // long black
    modifier: modifiers[0],
    order: 0
  },
  {
    product: products[3], // Iced Latte
    modifier: modifiers[0],
    order: 0
  },
  {
    product: products[3], // Iced Latte
    modifier: modifiers[1],
    order: 1
  },
  {
    product: products[3], // Iced Latte
    modifier: modifiers[2],
    order: 2
  }
];

export default productModifiers;
