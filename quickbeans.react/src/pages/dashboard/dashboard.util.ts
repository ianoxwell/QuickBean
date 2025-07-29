import { IProduct } from '@models/products.dto';
import { IVenueOpeningHours } from '@models/venue.dto';
import dayjs from 'dayjs';

export interface IFakeSalesData {
  date: string;
  Sales: number;
}

export const generateLastDaySales = (openingHours: IVenueOpeningHours[] | undefined) => {
  if (!openingHours) return [];
  const now = dayjs();
  const dayOfWeek = now.day(); // 0 (Sunday) - 6 (Saturday)
  const todayHours = openingHours[dayOfWeek];
  if (!todayHours || !todayHours.open || !todayHours.close) return [];

  const openHour = Math.floor(todayHours.open / 100); // e.g. 500 -> 5
  let closeHour = Math.floor(todayHours.close / 100); // e.g. 1300 -> 13
  const currentHour = now.hour();
  if (closeHour > currentHour) {
    closeHour = currentHour;
  }

  const data: IFakeSalesData[] = [];
  for (let i = openHour; i < closeHour; i++) {
    data.push({
      date: dayjs().hour(i).minute(0).format('HH:00'),
      Sales: Math.floor(Math.random() * 1000) + 200
    });
  }
  return data;
};

export const generateLastWeekSales = (lastDayData: IFakeSalesData[]) => {
  const data: IFakeSalesData[] = [];
  for (let i = 0; i < 6; i++) {
    data.push({
      date: dayjs().subtract(i, 'days').format('ddd'),
      Sales: Math.floor(Math.random() * 5000) + 1000
    });
  }
  // Push today's total sales as the 7th day (today)
  const todayTotal = lastDayData.reduce((sum: number, item: { Sales: number }) => sum + item.Sales, 0);
  data.push({
    date: dayjs().format('ddd'),
    Sales: todayTotal
  });
  return data.reverse();
};

// Fake data for best selling products
export const getBestSellingProducts = (products: IProduct[]) => {
  const fakeProducts = products.map((product) => ({
    product: product.name,
    quantity: Math.floor(Math.random() * 1000) + 100 // Random quantity between 100 and 1099
  }));
  return fakeProducts.sort((a, b) => b.quantity - a.quantity);
};

// Fake data for revenue by category
export const getRevenueByCategory = (productCategories: string[]) => {
  const fakeCategories = productCategories.map((category) => ({
    category: category,
    revenue: Math.floor(Math.random() * 5000) + 500 // Random revenue between 500 and 5499
  }));
  return fakeCategories.sort((a, b) => b.revenue - a.revenue);
};