import { usePayNowCreateOrderMutation } from '@app/apiSlice';
import { useAppSelector } from '@app/hooks';
import { CRoutes } from '@app/routes.const';
import { RootState } from '@app/store';
import { Accordion, Button, Flex, Image, Space, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import CartItem from '@pages/order/CartItem';
import { isMessage } from '@utils/typescriptHelpers';
import { CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import creditCard from '../../assets/visa-cards.png';
import './PaymentPage.scss';

const PaymentPage = () => {
  const base = import.meta.env.VITE_BASE_URL;
  const { checkout } = useAppSelector((store: RootState) => store.checkout);
  const { order } = useAppSelector((store: RootState) => store.order);
  const { user } = useAppSelector((store: RootState) => store.user);
  const [payNowOrder, { isLoading }] = usePayNowCreateOrderMutation();
  const navigate = useNavigate();
  const iconSize = 16;

  const payNow = async () => {
    // Simulate payment processing
    console.log('Processing payment...');
    if (!order || !user) {
      return;
    }

    const payResult = await payNowOrder({ ...order, patronId: user.user.id, patron: user.user }).unwrap();
    if (isMessage(payResult)) {
      notifications.show({ message: payResult.message, color: 'red' });
      return;
    }

    // Redirect to confirmation page or show success message
    navigate(`${base}${checkout?.checkoutUrl}/${CRoutes.confirmation}`, { state: { order } });
  };

  if (!order || !order.items || !order.items.length) {
    return navigate(`${base}${checkout?.checkoutUrl}/${CRoutes.menu}`);
  }

  return (
    <div className="payment-page">
      <h1>Fake Payment page</h1>
      <section className="payment-page__details">
        {order.items.map((item) => (
          <CartItem key={`${item.id}-${item.uniqueId}`} isEditable={false} item={item}></CartItem>
        ))}
      </section>
      <Space h="md" />
      <section className="payment-page__method">
        <h2>Choose your pretend payment</h2>
        <Accordion
          defaultValue="card"
          mt="md"
          variant="contained"
          chevronPosition="right"
          className="payment-page__accordion"
        >
          <Accordion.Item value="card">
            <Accordion.Control>Card Payment</Accordion.Control>
            <Accordion.Panel>
              <h3 className="payment-page__method-header">
                <CreditCard size={iconSize} />
                <span>Card</span>
              </h3>
              <TextInput
                label="Card Number"
                placeholder="1234 5678 9012 3456"
                rightSection={<Image h={24} w={100} src={creditCard} style={{ marginLeft: '-6rem' }} alt="Card" />}
                required
              />
              <Flex gap="md" mt="md" mb="md">
                <TextInput label="Expiry Date" placeholder="MM/YY" required />
                <TextInput label="CVV" placeholder="123" required />
              </Flex>
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="paypal">
            <Accordion.Control>PayPal</Accordion.Control>
            <Accordion.Panel>
              <p>PayPal payment details will go here.</p>
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="google-pay">
            <Accordion.Control>Google Pay</Accordion.Control>
            <Accordion.Panel>
              <p>Google Pay payment details will go here.</p>
            </Accordion.Panel>
          </Accordion.Item>
          <Accordion.Item value="apple-pay">
            <Accordion.Control>Apple Pay</Accordion.Control>
            <Accordion.Panel>
              <p>Apple Pay payment details will go here.</p>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </section>
      <section className="payment-page__pay-button">
        <Button
          type="button"
          fullWidth
          mt="xl"
          onClick={payNow}
          loading={isLoading}
          rightSection={<CreditCard size={iconSize} />}
        >
          Fake Pay Now
        </Button>
      </section>
    </div>
  );
};

export default PaymentPage;
