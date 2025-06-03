import { CRoutes } from '@app/routes.const';
import { RootState } from '@app/store';
import { Space, Stack, TableOfContents } from '@mantine/core';
import { useSelector } from 'react-redux';
import './MenuPage.scss';
import ProductItem from './ProductItem';

const MenuPage = () => {
  
  const { checkout } = useSelector((store: RootState) => store.checkout);

  return (
    <div>
      <h2>What would you like to order?</h2>
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
                  <a className="category-title-link" href={`${checkout.checkoutUrl}/${CRoutes.menu}/#${category.productType}`}>
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
