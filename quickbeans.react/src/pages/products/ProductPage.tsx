import { useGetProductQuery } from '@app/apiSlice';
import { CRoutes } from '@app/routes.const';
import BackButton from '@components/BackButton/BackButton.component';
import { Flex } from '@mantine/core';
import { isMessage } from '@utils/typescriptHelpers';
import { useParams } from 'react-router-dom';

const ProductPage = () => {
  const { id: productId } = useParams<{ id: string }>();
  const {
    data: products,
    isLoading,
    isError
  } = useGetProductQuery(productId || '', {
    skip: !productId
  });

  if (!productId) {
    return null; // Handle the case where productId is not provided
  }

  return (
    <>
      {isLoading && <div>Loading product...</div>}
      {isError && <div>Error loading product</div>}
      {!isLoading && !isError && products && !isMessage(products) && (
        <div>
          <Flex gap="md" align="center" mt="sm" mb="md">
            <BackButton back={CRoutes.products} />
            <h1>{products.name}</h1>
          </Flex>
          <p>Description: {products.description}</p>
          <p>Price: ${products.baseCost}</p>
          {/* Add more details as needed */}
        </div>
      )}
    </>
  );
};

export default ProductPage;
