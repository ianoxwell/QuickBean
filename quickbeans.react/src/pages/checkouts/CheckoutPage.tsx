import { useGetCheckoutQuery } from '@app/apiSlice';
import { CRoutes } from '@app/routes.const';
import { RootState } from '@app/store';
import BackButton from '@components/BackButton/BackButton.component';
import { Flex } from '@mantine/core';
import { isMessage } from '@utils/typescriptHelpers';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const CheckoutPage = () => {
  const { slug: checkoutSlug } = useParams<{ slug: string }>();
  const venueState = useSelector((store: RootState) => store.venue);
  const {
    data: checkout,
    isLoading,
    isError
  } = useGetCheckoutQuery(
    {
      slug: checkoutSlug || '',
      venueSlug: venueState.slug || ''
    },
    {
      skip: !checkoutSlug || !venueState.slug
    }
  );

  if (!checkoutSlug) {
    return null; // Handle the case where checkoutSlug is not provided
  }

  return (
    <div>
      {isLoading && <div>Loading checkout...</div>}
      {isError && <div>Error loading checkout</div>}
      {!isLoading && !isError && checkout && !isMessage(checkout) && (
        <div>
          <Flex gap="md" align="center" mt="sm" mb="md">
            <BackButton back={CRoutes.checkouts} />
            <h1>{checkout.name}</h1>
          </Flex>
          <p>Name: {checkout.name}</p>
          <p>Description: {checkout.description}</p>
          {/* Add more details as needed */}
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
