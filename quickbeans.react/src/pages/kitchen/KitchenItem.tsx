import { useUpdateOrderStatusMutation } from '@app/apiSlice';
import { CIconSizes } from '@app/appGlobal.const';
import { useAppSelector } from '@app/hooks';
import { Button, Card, Flex, Stack, Text } from '@mantine/core';
import { EOrderStatus } from '@models/base.dto';
import { IOrder } from '@models/order.dto';
import { fixWholeNumber } from '@utils/numberUtils';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { Clock } from 'lucide-react';
import { kitchenStatusColors } from './kitchen.util';

const KitchenItem = ({ order }: { order: IOrder }) => {
  dayjs.extend(utc);
  dayjs.extend(relativeTime);
  dayjs.extend(timezone);
  const { venue } = useAppSelector((state) => state.venue);
  dayjs.tz.setDefault(venue?.timezone || 'Australia/Brisbane'); // Set the timezone to the venue's timezone
  const date = dayjs.tz(order.orderDate);
  const [updateOrderStatus, { isLoading }] = useUpdateOrderStatusMutation();
  // eslint-disable-next-line prefer-const
  let { trafficLight = 'grey', nextStatus = EOrderStatus.PREPARING } = kitchenStatusColors(order.bookingStatus);
  const nextColor = kitchenStatusColors(nextStatus).trafficLight;

  const changeStatus = () => {
    // Dispatch an action to change the order status
    updateOrderStatus({ receiptNumber: order.receiptNumber || order.id?.toString() || '', status: nextStatus });
  };

  if (!order || !order.items || !order.items.length) {
    return <Text>No items in this order.</Text>;
  }

  // if the order was pending more than 10 minutes, set the traffic light to red
  if (order.bookingStatus === EOrderStatus.PENDING && date.isBefore(dayjs().subtract(10, 'minute'))) {
    trafficLight = 'red';
  }

  return (
    <Card radius="md" className="order-item">
      <Card.Section className={`order-item__header ${trafficLight}`}>
        <Flex justify="space-between">
          <Stack gap={0} align="flex-start">
            <Flex gap="xs" align="center">
              <Clock size={CIconSizes.large} />
              <Text size="md">{date.format('h:mm A')}</Text>
            </Flex>
            <Text>{date.fromNow()}</Text>
          </Stack>
          <Stack gap={0} align="flex-end">
            <Text>{order.patron?.name || order.patron?.email}</Text>
            <Text>{order.receiptNumber}</Text>
          </Stack>
        </Flex>
      </Card.Section>
      <p>Status: {order.bookingStatus}</p>
      {order.items.map((item) => (
        <Flex justify="space-between" mb="md" className="order-item__text" key={`${item.id}-${item.uniqueId}`}>
          <Stack gap={0}>
            <Text fw={700} className="order-item__title">
              {item.product.name}
            </Text>
            <Flex gap="xs" pl="sm" className="order-item__modifier">
              {item.selectedModifiers?.map((modifier, index) => (
                <Text fs="italic" key={`${item.id}-${item.uniqueId}-${index}`}>
                  {modifier.label}
                </Text>
              ))}
            </Flex>
          </Stack>

          <div className="order-item__price">
            <Text size="sm">${fixWholeNumber(item.price, 2)}</Text>
          </div>
        </Flex>
      ))}
      <Button
        type="button"
        onClick={changeStatus}
        fullWidth
        loading={isLoading}
        className={`order-item__button ${nextColor}`}
      >
        Change Status to {nextStatus}
      </Button>
    </Card>
  );
};

export default KitchenItem;
