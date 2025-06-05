import { useAppSelector } from '@app/hooks';
import { CRoutes } from '@app/routes.const';
import { RootState } from '@app/store';
import { Button, Divider, Flex } from '@mantine/core';
import { MapPin, Plus, StepForward } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CartItem from './CartItem';
import './OrderCartPage.scss';

const OrderCartPage = () => {
  const base = import.meta.env.VITE_BASE_URL;
  const { checkout } = useAppSelector((store: RootState) => store.checkout);
  const { order } = useAppSelector((store: RootState) => store.order);
  const { user } = useAppSelector((store: RootState) => store.user);
  const navigate = useNavigate();
  const iconSize = 16;

  const proceedToCheckout = () => {
    const checkoutUrl = user
      ? `${base}${checkout?.checkoutUrl}/${CRoutes.payment}`
      : `${base}${checkout?.checkoutUrl}/${CRoutes.login}`;
    navigate(checkoutUrl, { state: { order } });
  };

  if (!order || !order.items || !order.items.length) {
    return <p>Your cart is currently empty.</p>;
  }

  return (
    <>
      {!!order && !!checkout && (
        <div className="order-cart-page">
          <section className="order-cart-page__header">
            <div>
              <h1>Your order</h1>
              {!!checkout.venue && (
                <div className="order-cart-page__address">
                  <MapPin size={iconSize} />
                  <span>
                    {checkout.venue.address}, {checkout.venue.city}
                  </span>
                </div>
              )}
            </div>
            <Button type="button" leftSection={<Plus size={16} />}>
              Add to order
            </Button>
          </section>
          <section className="order-cart-page__details">
            {order.items.map((item) => (
              <CartItem key={`${item.id}-${item.uniqueId}`} isEditable={true} item={item}></CartItem>
            ))}
          </section>
          <Divider my="lg" variant="dashed" />
          <section className="order-cart-page__summary">
            <div className="order-cart-page__summary-total">
              <span className="order-cart-page__summary-total-label">Total (inc. tax)</span>
              <span className="order-cart-page__summary-total-value">${order.grandTotal.toFixed(2)}</span>
            </div>
            <Divider my="lg" variant="dashed" />
            <Flex justify="flex-end">
              <Button type="button" rightSection={<StepForward size={iconSize} />} onClick={proceedToCheckout}>
                Proceed to Checkout
              </Button>
            </Flex>
          </section>
        </div>
      )}
    </>
  );
};

export default OrderCartPage;
