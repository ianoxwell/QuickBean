import { useGetActiveProductsQuery } from '@app/apiSlice';
import { CIconSizes } from '@app/appGlobal.const';
import { RootState } from '@app/store';
import { Button, Divider, Flex, Grid } from '@mantine/core';
import { Plus } from 'lucide-react';
import { useSelector } from 'react-redux';
import ProductItem from './ProductItem';
import { useVenueNavigate } from '@app/useVenueNavigate';
import { CRoutes } from '@app/routes.const';

const ProductsListPage = () => {
  const venueState = useSelector((store: RootState) => store.venue);
  const {
    data: products,
    isLoading,
    isError
  } = useGetActiveProductsQuery(venueState.id, {
    skip: !venueState.id
  });
  const navigate = useVenueNavigate();

  const handleNew = () => {
    navigate(`/${CRoutes.products}/0`);
  };

  if (isLoading) {
    return <div>Loading products...</div>;
  }

  if (isError) {
    return <div>Error loading products</div>;
  }

  if (!venueState.id) {
    return <div>Venue possibly not loaded when the component initialised. {JSON.stringify(venueState)}</div>;
  }

  return (
    <div>
      <Flex justify="space-between" align="center">
        <h1>List of Products</h1>
        <Button type="button" onClick={handleNew} leftSection={<Plus size={CIconSizes.medium} />}>
          New
        </Button>
      </Flex>
      <Divider my="md" />
      {products && (
        <Grid>
          {products.map((product) => (
            <Grid.Col span={{ base: 12, md: 6, lg: 3 }} key={product.id}>
              <ProductItem product={product} />
            </Grid.Col>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default ProductsListPage;
