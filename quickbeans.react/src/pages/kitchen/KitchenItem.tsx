import { IOrder } from '@models/order.dto';

const KitchenItem = ({ order }: { order: IOrder }) => {
  return (
    <div>
      <h3>Order #{order.receiptNumber}</h3>
      <p>Status: {order.bookingStatus}</p>
      <ul>
        {order.items.map((item) => (
          <li key={item.id}>
            {item.product.name} - {item.quantity}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default KitchenItem;
