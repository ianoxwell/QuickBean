import { mapProductModifierToIProductModifier } from '@controllers/modifier/modifierMaps.util';
import { IProduct, IProductShort } from '@models/products.dto';
import { Product } from './Product.entity';

export function mapProductToIProductShort(product: Product): IProductShort {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    productType: product.productType,
    imageUrl: product.imageUrl
  };
}

export function mapProductToIProduct(product: Product): IProduct {
  return {
    ...mapProductToIProductShort(product),
    baseCost: Number(product.baseCost),
    modifiers: product.productModifiers
      .map((modifier) => mapProductModifierToIProductModifier({ ...modifier, product }))
      .sort((a, b) => a.order - b.order)
  };
}
