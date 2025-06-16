import { useGetOrderStatusEventsQuery } from '@app/apiSlice';
import { useAppSelector } from '@app/hooks';
import { RootState } from '@app/store';
import { SimpleGrid } from '@mantine/core';
import KitchenItem from './KitchenItem';

const KitchenPage = () => {
  // subscribe to the websocket for kitchen updates
  const { user } = useAppSelector((state: RootState) => state.user);
  const venueState = useAppSelector((state: RootState) => state.venue);
  const { data: kitchenOrders } = useGetOrderStatusEventsQuery({
    venueId: venueState.id || 0,
    userId: user?.user.id || 0
  });

  return (
    <>
      <div>Kitchen Grid</div>
      <SimpleGrid
        cols={{ base: 1, sm: 2, lg: 5 }}
        spacing={{ base: 10, sm: 'xl' }}
        verticalSpacing={{ base: 'md', sm: 'xl' }}
      >
        {kitchenOrders?.map((order) => (
          <KitchenItem key={order.receiptNumber} order={order} />
        ))}
      </SimpleGrid>
    </>
  );
};

export default KitchenPage;
