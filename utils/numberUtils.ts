import { IOrder } from "@models/order.dto";

export const fractionNumber = (value: number | string | undefined): string => {
  if (!value) {
    return '0';
  }

  // to fixed 2 decimal places first to ensure that 0.24567 becomes 1/4 cup
  const num = typeof value === 'number' ? Number(value.toFixed(2)) : Number(Number(value).toFixed(2));
  const whole = Math.floor(num);
  const decimal = num - whole;

  const fractions: Record<number, string> = {
    0.125: '&#8539;', // 1/8
    0.25: '&#188;', // 1/4
    0.375: '&#8540;', // 3/8
    0.5: '&#189;', // 1/2
    0.625: '&#8541;', // 5/8
    0.75: '&#190;', // 3/4
    0.875: '&#8542;' // 7/8
  };

  if (decimal === 0) {
    return whole.toString();
  }

  if (fractions[decimal]) {
    return whole === 0 ? fractions[decimal] : `${whole} ${fractions[decimal]}`.trim();
  }

  return num.toFixed(2);
};

/** Takes the nutrient values 24.000, 0.1234 and returns '24' or '0.123' */
export const fixWholeNumber = (value: number | string | undefined, length = 3): string => {
  if (!value || isNaN(Number(value))) {
    return '0';
  }

  const num = Number(value);
  return num.toFixed(length);
};

export const calculateItemCount = (order: IOrder | undefined): number => {
  if (!order || !order.items) return 0;
  return order.items.reduce((count, item) => count + item.quantity, 0);
};

// Utility function to delay execution
export const delay = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}