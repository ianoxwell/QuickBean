import QuantityInput from '@components/QuantityInput/QuantityInput.component';
import { Card, Image } from '@mantine/core';
import { IOrderItem } from '@models/order.dto';
import { modifyCheckoutItem } from './order.slice';
import { useAppDispatch } from '@app/hooks';
import { Plural } from '@components/Plural/Plural';

const CartItem = ({ item, isEditable }: { item: IOrderItem; isEditable: boolean }) => {
  const dispatch = useAppDispatch();
  const handleQuantityChange = (quantity: number | string) => {
    const itemCopy = structuredClone(item); // Create a copy of the item to avoid direct mutation
    itemCopy.quantity = typeof quantity === 'string' ? parseInt(quantity, 10) : quantity;
    dispatch(modifyCheckoutItem(itemCopy));
  };

  return (
    <Card radius="md" className="order-item">
      <Card.Section className="order-item__image">
        <Image src={item.product.imageUrl} radius="md" alt={item.product.name} />
      </Card.Section>
      <div className="order-item__text">
        <h3 className="order-item__title">{item.product.name}</h3>
        <div className="order-item__modifier">
          {item.selectedModifiers?.map((modifier, index) => (
            <span key={`${item.id}-${item.uniqueId}-${index}`}>{modifier.label}</span>
          ))}
        </div>
        <div className="order-item__price">
          <span>Price: ${item.price.toFixed(2)}</span>
        </div>
      </div>
      <div className="order-item__quantity">
        {isEditable ? (
          <QuantityInput quantity={item.quantity} size="sm" onChange={handleQuantityChange} />
        ) : (
          <span className="order-item__quantity--text">
            {item.quantity} <Plural text="item" num={item.quantity} />
          </span>
        )}
      </div>
    </Card>
  );
};

export default CartItem;
