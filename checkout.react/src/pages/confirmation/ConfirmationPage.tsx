import { useGetOrderStatusEventsQuery } from '@app/apiSlice';
import { RootState } from '@app/store';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import ConfirmationTimeline from './ConfirmationTimeline';
import './ConfirmationPage.scss'

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
    <section className="confirmation-page">
      <h1>Confirmation page</h1>
      <p>Thank you for your order!</p>
      <p>Your order has been successfully placed. Receipt number: <strong>{receiptNumber}</strong></p>
      <div className="order-status-updates">
        {!!statusUpdate && <ConfirmationTimeline status={statusUpdate.status} />}
      </div>
    </section>
  );
};

export default ConfirmationPage;
