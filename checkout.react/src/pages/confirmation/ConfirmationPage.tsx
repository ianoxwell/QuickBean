import { useGetOrderStatusEventsQuery } from '@app/apiSlice';
import { useAppDispatch, useAppSelector } from '@app/hooks';
import { RootState } from '@app/store';
import { clearCheckout } from '@pages/order/order.slice';
import { fixWholeNumber } from '@utils/numberUtils';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './ConfirmationPage.scss';
import ConfirmationTimeline from './ConfirmationTimeline';

const ConfirmationPage = () => {
  const { receiptNumber } = useParams<{ receiptNumber: string }>();
  const { checkout } = useAppSelector((store: RootState) => store.checkout);
  const { user } = useAppSelector((store: RootState) => store.user);
  const { order } = useAppSelector((store: RootState) => store.order);
  const [currentOrder] = useState(order || null);
  const dispatch = useAppDispatch();
  const { data: statusUpdate } = useGetOrderStatusEventsQuery({
    receiptNumber: receiptNumber || '',
    userId: user?.user.id || 0,
    venueId: checkout?.venue?.id || 0
  });

  useEffect(() => {
    if (order) {
      dispatch(clearCheckout());
    }
  }, [order, dispatch]);

  return (
    <section className="confirmation-page">
      <h1>Confirmation page</h1>
      <p>Thank you for your order!</p>
      <p>
        Your order has been successfully placed. Receipt number: <strong>{receiptNumber}</strong>
      </p>
      <div className="order-status-updates">
        {!!statusUpdate && <ConfirmationTimeline status={statusUpdate.status} />}
      </div>
      {!!currentOrder && (
        <div className="order-details">
          <h2>Order Details</h2>
          <div>Total Amount: ${fixWholeNumber(currentOrder.grandTotal, 2)}</div>
          <div>Items: {currentOrder.items.map((item) => `${item.quantity} x ${item.product.name}`).join(', ')}</div>
        </div>
      )}
    </section>
  );
};

export default ConfirmationPage;
