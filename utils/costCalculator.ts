import { IOrderItem } from '@models/order.dto';
import { IProduct } from '@models/products.dto';

export const calcOrderItemPrice = (orderItem: IOrderItem, product: IProduct | undefined): number => {
  if (!orderItem || !product) return 0;

  const modifiersTotal =
    orderItem.selectedModifiers?.reduce((acc, modifier) => {
      if (modifier.priceAdjustment != null) {
        return acc + Number(modifier.priceAdjustment);
      }
      if (modifier.percentAdjustment) {
        return acc + product.baseCost * modifier.percentAdjustment;
      }
      return acc;
    }, 0) ?? 0;

  return (product.baseCost + modifiersTotal) * orderItem.quantity;
};

export const calcOrderTotal = (orderItems: IOrderItem[], products: IProduct[]): number => {
  if (!orderItems || orderItems.length === 0) return 0;

  return orderItems.reduce((total, item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) {
      console.warn(`Product with id ${item.productId} not found in products list.`);
      return total; // Skip this item if product is not found
    }

    const itemPrice = calcOrderItemPrice(item, product); // Base cost is not used here
    return total + itemPrice;
  }, 0);
};
