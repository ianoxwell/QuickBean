import { IModifier, IProductModifier, IModifierOption, IProductModifierOption } from '@models/modifier.dto';
import { Modifier, ModifierOption } from './Modifier.entity';
import { mapProductToIProductShort } from '@controllers/product/productMaps.util';
import { ProductModifier } from '@controllers/product/ProductModifierJoin.entity';

export function mapModifierToIModifier(modifier: Modifier): IModifier {
  return {
    id: modifier.id,
    name: modifier.name,
    isRequired: modifier.isRequired,
    options: modifier.options.map((option) => mapModifierOptionsToIModifierOption(option))
  };
}

/** Used by the modifier admin page to list the products this modifier interacts with */
export function mapModifierToIProductModifier(modifier: Modifier): IModifier {
  return {
    ...mapModifierToIModifier(modifier),
    products: modifier.productModifiers
      ? modifier.productModifiers.filter((pm) => pm.id !== undefined).map((pm) => mapProductToIProductShort(pm.product))
      : []
  };
}

/** Used in the Product itself for the modifiers */
export function mapProductModifierToIProductModifier(productModifier: ProductModifier): IProductModifier {
  const modifier = productModifier.modifier;
  const product = productModifier.product;
  return {
    id: modifier.id,
    name: modifier.name,
    isRequired: modifier.isRequired,
    order: productModifier.order,
    options: modifier.options.map((option) => mapProductModifierOptionToIProductModifierOption(option, product.baseCost))
  };
}

export function mapProductModifierOptionToIProductModifierOption(
  modifierOption: ModifierOption,
  baseCost?: number
): IProductModifierOption {
  return {
    id: modifierOption.id,
    label: modifierOption.label,
    description: modifierOption.description,
    priceAdjustment: modifierOption.percentAdjustment
      ? Number(modifierOption.percentAdjustment) * baseCost
      : Number(modifierOption.priceAdjustment),
    isDefault: modifierOption.isDefault
  };
}

export function mapModifierOptionsToIModifierOption(modifierOption: ModifierOption): IModifierOption {
  return {
    id: modifierOption.id,
    label: modifierOption.label,
    description: modifierOption.description,
    priceAdjustment: Number(modifierOption.priceAdjustment),
    percentAdjustment: Number(modifierOption.percentAdjustment),
    isDefault: modifierOption.isDefault
  };
}
