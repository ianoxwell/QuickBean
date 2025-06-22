import { useGetActiveProductsQuery } from '@app/apiSlice';
import { RootState } from '@app/store';
import { Grid } from '@mantine/core';
import { useSelector } from 'react-redux';
import ProductItem from './ProductItem';

const ProductsListPage = () => {
  const venueState = useSelector((store: RootState) => store.venue);
  const {
    data: products,
    isLoading,
    isError
  } = useGetActiveProductsQuery(venueState.id, {
    skip: !venueState.id
  });

  return (
    <div>
      <h1>List of Products</h1>
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error loading products.</p>}
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
