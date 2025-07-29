import { useAppSelector } from '@app/hooks';
import { RootState } from '@app/store';
import { AreaChart, BarChart } from '@mantine/charts';
import { Card, Grid, Text, Title } from '@mantine/core';
import { EProductType } from '@models/base.dto';
import { convertProductType } from '@utils/stringUtils';
import { useState } from 'react';
import { generateLastDaySales, generateLastWeekSales, getBestSellingProducts, getRevenueByCategory } from './dashboard.util';

const DashboardPage = () => {
  const venueState = useAppSelector((state: RootState) => state.venue);
  const products = venueState.venue?.products || [];
  const productCategories = Object.values(EProductType).map((type) => convertProductType(type));
  const chartHeight = 300;
  const [lastDayData] = useState(generateLastDaySales(venueState.venue?.openingHours));
  const [lastWeekData] = useState(generateLastWeekSales(lastDayData));
  const [bestSellingProducts] = useState(getBestSellingProducts(products));
  const [revenueByCategory] = useState(getRevenueByCategory(productCategories));

  return (
    <div>
      <Title order={2} >
        Dashboard
      </Title>
      <Text mb="lg" c="dimmed" size="sm">Note for demo purposes this is all fake data</Text>
      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder radius="md" padding="xl">
            <Text fz="lg" fw={500}>
              Today's Sales
            </Text>
            <AreaChart
              h={chartHeight}
              mt={16}
              data={lastDayData}
              dataKey="date"
              series={[{ name: 'Sales', color: 'indigo.6' }]}
              curveType="monotone"
              withXAxis
              withYAxis
              yAxisLabel="Sales ($AUD)"
              xAxisLabel="Time"
            />
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder radius="md" padding="xl">
            <Text fz="lg" fw={500}>
              Last 7 Days Sales totals
            </Text>
            <BarChart
              h={chartHeight}
              mt={16}
              data={lastWeekData}
              dataKey="date"
              series={[{ name: 'Sales', color: 'blue.6' }]}
              withXAxis
              withYAxis
              yAxisLabel="Sales ($AUD)"
              xAxisLabel="Day of the week"
            />
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder radius="md" padding="xl">
            <Text fz="lg" fw={500}>
              Last 7 Days Top Products
            </Text>
            <BarChart
              h={chartHeight}
              mt={16}
              data={bestSellingProducts}
              dataKey="product"
              series={[{ name: 'quantity', color: 'blue.6' }]}
              withXAxis
              withYAxis
              yAxisLabel="Quantity Sold"
              xAxisLabel="Product"
            />
          </Card>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card withBorder radius="md" padding="xl">
            <Text fz="lg" fw={500}>
              Last 7 Days Top Categories
            </Text>
            <BarChart
              h={chartHeight}
              mt={16}
              data={revenueByCategory}
               orientation="vertical"
              dataKey="category"
              series={[{ name: 'revenue', color: 'blue.6' }]}
              withXAxis
              withYAxis
              xAxisLabel="Revenue ($AUD)"
            />
          </Card>
        </Grid.Col>
      </Grid>
    </div>
  );
};

export default DashboardPage;
