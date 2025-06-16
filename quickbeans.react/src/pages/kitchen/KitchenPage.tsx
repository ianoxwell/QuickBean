import { useGetOrderStatusEventsQuery } from '@app/apiSlice';
import { useAppSelector } from '@app/hooks';
import { RootState } from '@app/store';
import { SimpleGrid, Space } from '@mantine/core';
import KitchenItem from './KitchenItem';
import './KitchenPage.scss';
import { EOrderStatus } from '@models/base.dto';

const KitchenPage = () => {
  // subscribe to the websocket for kitchen updates
  const { user } = useAppSelector((state: RootState) => state.user);
  const venueState = useAppSelector((state: RootState) => state.venue);
  const { data: kitchenOrders } = useGetOrderStatusEventsQuery({
    venueId: venueState.id || 0,
    userId: user?.user.id || 0
  });

  return (
    <section className="kitchen-page">
      <h2>Kitchen page - header summary</h2>
      <Space h="md" />
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3, xl: 4 }} spacing="lg" verticalSpacing="lg">
        {kitchenOrders
          ?.filter((order) => ![EOrderStatus.COMPLETED, EOrderStatus.CANCELLED].includes(order.bookingStatus))
          .map((order) => (
            <KitchenItem key={order.receiptNumber} order={order} />
          ))}
      </SimpleGrid>
    </section>
  );
};

export default KitchenPage;
