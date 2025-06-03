import { useAppSelector } from '@app/hooks';
import { RootState } from '@app/store';
import { Button } from '@mantine/core';
import { getDateObject } from '@utils/dateUtils';
import dayjs from 'dayjs';

const OrderCartPage = () => {
  const { checkout } = useAppSelector((store: RootState) => store.checkout);
  const { order } = useAppSelector((store: RootState) => store.order);

  return (
    <div>
      <h1>Order Cart</h1>
      <p>Checkout URL: {checkout?.checkoutUrl}</p>
      <p>Order ID: {order?.id}</p>
      <p>Order Date: {dayjs(getDateObject(order?.orderDate)).format('MMMM D, YYYY HH:mm')}</p>
      <p>Receipt Number: {order?.receiptNumber}</p>
      <p>Amount Paid: {order?.amountPaid}</p>
      <p>Grand Total: {order?.grandTotal}</p>
      <p>Discount: {order?.discount}</p>
      <p>Comments: {order?.comments}</p>
      <h2>Items in Order:</h2>
      <ul>
        {order?.items.map((item) => (
          <li key={item.id}>
            {item.product.name} - Quantity: {item.quantity} - Price: ${item.price.toFixed(2)}
          </li>
        ))}
      </ul>
      <Button size="input-sm" type="button">
        Proceed to Checkout
      </Button>
    </div>
  );
};

export default OrderCartPage;
