import { CIconSizes } from '@app/appGlobal.const';
import { CRoutes } from '@app/routes.const';
import { RootState } from '@app/store';
import { useVenueNavigate } from '@app/useVenueNavigate';
import { Button, Divider, Flex, Stack } from '@mantine/core';
import { Plus } from 'lucide-react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useGetActiveCheckoutsQuery } from './checkoutApiSlice';
import CheckoutListItem from './CheckoutListItem';
import './checkouts.scss'; // Import the styles for checkouts

const CheckoutsListPage = () => {
  const base = import.meta.env.VITE_BASE_URL;
  const venueState = useSelector((store: RootState) => store.venue);
  const navigate = useVenueNavigate();

  const {
    data: checkouts,
    isLoading,
    isError
  } = useGetActiveCheckoutsQuery(venueState.id, {
    skip: !venueState.id
  });

  const handleNew = () => {
    navigate(`/${CRoutes.checkouts}/new`);
  };

  return (
    <>
      {isLoading && <div>Loading...</div>}
      {isError && <div>Error loading checkouts</div>}
      {!isLoading && !isError && checkouts && (
        <div className="form">
          <Flex justify="space-between" align="center">
            <h1>Checkouts list</h1>
            <Button type="button" onClick={handleNew} leftSection={<Plus size={CIconSizes.medium} />}>
              New
            </Button>
          </Flex>
          <Divider my="md" />
          <Stack gap="lg">
            {checkouts.map((checkout) => (
              <Link to={`${base}${venueState.slug}/${CRoutes.checkouts}/${checkout.slug}`} className='checkout-item__link' key={checkout.id}>
                <CheckoutListItem checkoutShort={checkout} />
              </Link>
            ))}
          </Stack>
        </div>
      )}
    </>
  );
};

export default CheckoutsListPage;
