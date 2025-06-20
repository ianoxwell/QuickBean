import { EOrderStatus } from '@models/base.dto';

export const kitchenStatusColors = (status: EOrderStatus): { trafficLight: string; nextStatus: EOrderStatus } => {
  switch (status) {
    case EOrderStatus.PREPARING:
      return { trafficLight: 'yellow', nextStatus: EOrderStatus.READY };
    case EOrderStatus.READY:
      return { trafficLight: 'green', nextStatus: EOrderStatus.COMPLETED };
    case EOrderStatus.COMPLETED:
      return { trafficLight: 'blue', nextStatus: EOrderStatus.COMPLETED };
    default:
      return { trafficLight: 'grey', nextStatus: EOrderStatus.PREPARING };
  }
};
