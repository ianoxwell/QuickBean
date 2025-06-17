import { Timeline } from '@mantine/core';
import { EOrderStatus } from '@models/base.dto';
import { BellRing, Check, ChefHat, Hourglass } from 'lucide-react';

const ConfirmationTimeline = ({ status }: { status: EOrderStatus }) => {
  let active = 0;
  const iconSize = 16;

  switch (status) {
    case EOrderStatus.COMPLETED:
      active = 3;
      break;
    case EOrderStatus.READY:
      active = 2;
      break;
    case EOrderStatus.PREPARING:
      active = 1;
      break;
    default:
      active = 0; // Default to the first step if status is not recognized
  }
  return (
    <Timeline active={active} bulletSize={30} lineWidth={2} color="green">
      <Timeline.Item bullet={<Hourglass size={iconSize} />} title="Order Placed" />
      <Timeline.Item bullet={<ChefHat size={iconSize} />} title="Preparing Order" />
      <Timeline.Item bullet={<BellRing size={iconSize} />} title="Order Ready - Pick up from counter!" />
      <Timeline.Item bullet={<Check size={iconSize} />} title="Order Completed" />
    </Timeline>
  );
};

export default ConfirmationTimeline;
