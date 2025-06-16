import { useUpdateOrderStatusMutation } from '@app/apiSlice';
import { Button, Card, Flex, Stack, Text } from '@mantine/core';
import { EOrderStatus } from '@models/base.dto';
import { IOrder } from '@models/order.dto';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Clock } from 'lucide-react';

const KitchenItem = ({ order }: { order: IOrder }) => {
  dayjs.extend(relativeTime);
  const date = dayjs(order.orderDate);
  const iconSize = 20;
  const [updateOrderStatus, { isLoading }] = useUpdateOrderStatusMutation();
  let trafficLight = 'grey';
  let nextStatus = EOrderStatus.PREPARING;

  const changeStatus = () => {
    // Dispatch an action to change the order status
    updateOrderStatus({ receiptNumber: order.receiptNumber || order.id?.toString() || '', status: nextStatus });
  };

  if (!order || !order.items || !order.items.length) {
    return <Text>No items in this order.</Text>;
  }

  switch (order.bookingStatus) {
    case EOrderStatus.PREPARING:
      trafficLight = 'yellow';
      nextStatus = EOrderStatus.READY;
      break;
    case EOrderStatus.READY:
      nextStatus = EOrderStatus.COMPLETED;
      trafficLight = 'green';
      break;
    case EOrderStatus.COMPLETED:
      trafficLight = 'blue';
      break;
    default:
      trafficLight = 'grey';
      break;
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
              <Clock size={iconSize} />
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
      <h3>Order #{order.receiptNumber}</h3>
      <p>Status: {order.bookingStatus}</p>
      <ul>
        {order.items.map((item) => (
          <li key={item.id}>
            {item.product.name} - {item.quantity}
          </li>
        ))}
      </ul>
      {/* <Flex justify="space-between" align="center">
        <Text>Grand Total: ${order.grandTotal}</Text>
        <Text>Next Status: {nextStatus}</Text>
      </Flex> */}
      <Button type="button" onClick={changeStatus} fullWidth loading={isLoading}>
        Change Status to {nextStatus}
      </Button>
    </Card>
  );
};

export default KitchenItem;
