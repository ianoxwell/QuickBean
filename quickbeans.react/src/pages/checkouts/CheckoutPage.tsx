import { useGetCheckoutQuery } from '@app/apiSlice';
import { CRoutes } from '@app/routes.const';
import { RootState } from '@app/store';
import { useVenueNavigate } from '@app/useVenueNavigate';
import { ActionIcon, Flex } from '@mantine/core';
import { isMessage } from '@utils/typescriptHelpers';
import { CornerDownLeft } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const CheckoutPage = () => {
  const { slug: checkoutSlug } = useParams<{ slug: string }>();
  const venueState = useSelector((store: RootState) => store.venue);
  const venueNavigate = useVenueNavigate();
  const iconSize = 20;
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
            <ActionIcon
              type="button"
              variant="default"
              radius="xl"
              size="lg"
              aria-label="Back"
              onClick={() => venueNavigate(CRoutes.checkouts)}
            >
              <CornerDownLeft size={iconSize} />
            </ActionIcon>
            <h2>{checkout.name}</h2>
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
