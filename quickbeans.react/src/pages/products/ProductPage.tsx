import { useGetProductQuery } from '@app/apiSlice';
import { CRoutes } from '@app/routes.const';
import { RootState } from '@app/store';
import BackButton from '@components/BackButton/BackButton.component';
import { Flex } from '@mantine/core';
import { isMessage } from '@utils/typescriptHelpers';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const ProductPage = () => {
  const { id: productId } = useParams<{ id: string }>();
  const venueState = useSelector((store: RootState) => store.venue);
  const {
    data: product,
    isLoading,
    isError
  } = useGetProductQuery(
    { productId: productId || '', venueId: venueState.id || 0 },
    {
      skip: !productId || !venueState.id
    }
  );

  if (!productId) {
    return null; // Handle the case where productId is not provided
  }

  return (
    <>
      {isLoading && <div>Loading product...</div>}
      {isError && <div>Error loading product</div>}
      {!isLoading && !isError && product && !isMessage(product) && (
        <div>
          <Flex gap="md" align="center" mt="sm" mb="md">
            <BackButton back={CRoutes.products} />
            <h1>{product.name}</h1>
          </Flex>
          <p>Description: {product.description}</p>
          <p>Price: ${product.baseCost}</p>
          <p>
            Image: <img src={product.imageUrl} alt={product.name} style={{ maxWidth: '200px' }} />
          </p>
          <p>Product Type: {product.productType}</p>
          {product.modifiers && product.modifiers.length > 0 && (
            <>
              <h3>Modifiers:</h3>
              <ul>
                {product.modifiers.map((modifierGroup) => (
                  <li key={modifierGroup.id}>
                    <strong>{modifierGroup.name}</strong>
                    <ul>
                      {modifierGroup.options.map((modifier) => (
                        <li key={modifier.id}>
                          {modifier.label} (+${modifier.priceAdjustment?.toFixed(2)})
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ProductPage;
