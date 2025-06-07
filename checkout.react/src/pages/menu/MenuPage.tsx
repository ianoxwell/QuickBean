import { useGetOrderStatusEventsQuery, useUpdateOrderStatusMutation } from '@app/apiSlice';
import { CRoutes } from '@app/routes.const';
import { RootState } from '@app/store';
import { Button, Flex, Space, Stack, TableOfContents } from '@mantine/core';
import { EBookingStatus } from '@models/base.dto';
import { isMessage } from '@utils/typescriptHelpers';
import { useSelector } from 'react-redux';
import './MenuPage.scss';
import ProductItem from './ProductItem';

const MenuPage = () => {
  const { checkout } = useSelector((store: RootState) => store.checkout);
  const { data: orderStatusUpdates = [] } = useGetOrderStatusEventsQuery({
    receiptNumber: 'R-123456',
    userId: 42
  });
  const [updateOrderStatus, { data: orderStatus }] = useUpdateOrderStatusMutation();

  return (
    <div>
      <h2>What would you like to order?</h2>
      <Space h="md" />
      <div className="order-status-updates">
        {orderStatusUpdates.map((statusUpdate) => (
          <div key={statusUpdate.receiptNumber}>
            <strong>Receipt: {statusUpdate.receiptNumber}</strong> - Status: {statusUpdate.bookingStatus}
          </div>
        ))}
      </div>
      <div>Order status - {orderStatus && !isMessage(orderStatus) ? orderStatus.bookingStatus : 'Not updated yet'}</div>
      <Flex gap="md">
        <Button
          type="button"
          onClick={() => updateOrderStatus({ receiptNumber: 'R-BNWXB8', status: EBookingStatus.PREPARING })}
        >
          Update Order Preparing
        </Button>
        <Button
          type="button"
          onClick={() => updateOrderStatus({ receiptNumber: 'R-BNWXB8', status: EBookingStatus.READY })}
        >
          Update Order Ready
        </Button>
        <Button
          type="button"
          onClick={() => updateOrderStatus({ receiptNumber: 'R-BNWXB8', status: EBookingStatus.COMPLETED })}
        >
          Update Order Complete
        </Button>
      </Flex>
      {(() => {
        if (!checkout) {
          return <p>Loading...</p>;
        }
        return (
          <div className="menu-page">
            <nav aria-label="Menu Categories" className="menu-categories">
              <TableOfContents
                variant="filled"
                color="accent"
                size="md"
                getControlProps={({ data }) => ({
                  component: 'a',
                  href: `/${checkout.checkoutUrl}/${CRoutes.menu}#${data.id}`,
                  children: data.value
                })}
                scrollSpyOptions={{
                  selector: '[data-heading]',
                  getDepth: (element) => Number(element.getAttribute('data-order')),
                  getValue: (element) => element.getAttribute('data-heading') || ''
                }}
              />
            </nav>
            <Space h="xl" />
            {checkout.categories.map((category) => (
              <div key={category.id}>
                <div
                  id={category.productType}
                  data-heading={category.name}
                  data-order="2"
                  className="data-heading-offset"
                ></div>
                <h3 data-order={2}>
                  <a
                    className="category-title-link"
                    href={`${checkout.checkoutUrl}/${CRoutes.menu}/#${category.productType}`}
                  >
                    {category.name}
                  </a>
                </h3>
                <Space h="md" />
                <Stack gap="md" align="stretch" className="product-list">
                  {category.products.map((product) => (
                    <ProductItem key={product.id} product={product} />
                  ))}
                </Stack>
                <Space h="xl" />
              </div>
            ))}
          </div>
        );
      })()}
    </div>
  );
};

export default MenuPage;
