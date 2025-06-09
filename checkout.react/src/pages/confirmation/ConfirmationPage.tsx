import { useGetOrderStatusEventsQuery } from '@app/apiSlice';
import { RootState } from '@app/store';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const ConfirmationPage = () => {
  const { receiptNumber } = useParams<{ receiptNumber: string }>();
  const { checkout } = useSelector((store: RootState) => store.checkout);
  const { user } = useSelector((store: RootState) => store.user);
  const { data: statusUpdate } = useGetOrderStatusEventsQuery({
    receiptNumber: receiptNumber || '',
    userId: user?.user.id || 0,
    venueId: checkout?.venue?.id || 0
  });
  return (
    <div>
      <h1>Confirmation page</h1>
      <p>Thank you for your order!</p>
      <p>Your order has been successfully placed.</p>
      <div>Listen to the other status on web for order {receiptNumber}</div>
      <div className="order-status-updates">
        {!!statusUpdate && (
          <div>
            <strong>Receipt: {statusUpdate.receiptNumber}</strong> - Status: {statusUpdate.status}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfirmationPage;
