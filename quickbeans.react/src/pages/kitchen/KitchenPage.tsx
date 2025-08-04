import { useGetOrderStatusEventsQuery } from '@app/apiSlice';
import { useAppSelector } from '@app/hooks';
import { RootState } from '@app/store';
import { SimpleGrid } from '@mantine/core';
import { EOrderStatus } from '@models/base.dto';
import { IOrder } from '@models/order.dto';
import { useEffect, useState } from 'react';
import KitchenItem from './KitchenItem';
import './KitchenPage.scss';

const KitchenPage = () => {
  // subscribe to the websocket for kitchen updates
  const { user } = useAppSelector((state: RootState) => state.user);
  const venueState = useAppSelector((state: RootState) => state.venue);
  const { data: kitchenOrders } = useGetOrderStatusEventsQuery({
    venueId: venueState.id || 0,
    userId: user?.user.id || 0
  });
  const [orders, setOrders] = useState<IOrder[]>([]);

  const filterOrders = (orders: IOrder[] | undefined) => {
    if (!orders) return [];

    return orders.filter((order) => ![EOrderStatus.COMPLETED, EOrderStatus.CANCELLED].includes(order.bookingStatus));
  };

  useEffect(() => {
    // This effect runs when the component mounts or when kitchenOrders changes
    if (kitchenOrders) {
      setOrders(filterOrders(kitchenOrders));
    }
  }, [kitchenOrders]);

  return (
    <section className="kitchen-page">
      <h1>Kitchen display</h1>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3, xl: 4 }} mt="xl" spacing="lg" verticalSpacing="lg">
        {orders.length > 0 ? (
          orders.map((order) => <KitchenItem key={order.receiptNumber} order={order} />)
        ) : (
          <div>No orders found</div>
        )}
      </SimpleGrid>
    </section>
  );
};

export default KitchenPage;
