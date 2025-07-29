import { useGetActiveModifiersQuery } from '@app/apiSlice';
import { CIconSizes } from '@app/appGlobal.const';
import { CRoutes } from '@app/routes.const';
import { RootState } from '@app/store';
import { useVenueNavigate } from '@app/useVenueNavigate';
import { Button, Divider, Flex } from '@mantine/core';
import ProductModifierItem from '@pages/products/ProductModifierItem';
import { Plus } from 'lucide-react';
import { useSelector } from 'react-redux';

const ModifiersPage = () => {
  const venueState = useSelector((store: RootState) => store.venue);
  const navigate = useVenueNavigate();

  const {
    data: modifiers,
    isLoading,
    isError
  } = useGetActiveModifiersQuery(venueState.id, {
    skip: !venueState.id
  });

  const handleNew = () => {
    navigate(`/${CRoutes.modifiers}/0`);
  };

  return (
    <>
      {isLoading && <div>Loading...</div>}
      {isError && <div>Error loading modifiers</div>}
      {!isLoading && !isError && modifiers && (
        <div>
          <Flex justify="space-between" align="center">
            <h1>List of Modifiers</h1>
            <Button type="button" onClick={handleNew} leftSection={<Plus size={CIconSizes.medium} />}>
              New
            </Button>
          </Flex>
          <Divider my="md" />

          {modifiers.map((modifier) => (
            <ProductModifierItem dragHandleProps={undefined} key={modifier.id} modifier={modifier} isViewVisible={true} />
          ))}
        </div>
      )}
    </>
  );
};

export default ModifiersPage;
