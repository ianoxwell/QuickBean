import { useParams } from 'react-router-dom';

const CheckoutPage = () => {
  const { id: checkoutId } = useParams<{ id: string }>();
  if (!checkoutId) {
    return null; // Handle the case where checkoutId is not provided
  }

  return (
    <div>
      <h2>Checkout ID: {checkoutId}</h2>
    </div>
  );
};

export default CheckoutPage;
