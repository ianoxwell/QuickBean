import { useGetModifierQuery } from '@app/apiSlice';
import { CRoutes } from '@app/routes.const';
import BackButton from '@components/BackButton/BackButton.component';
import { Flex } from '@mantine/core';
import { isMessage } from '@utils/typescriptHelpers';
import { useParams } from 'react-router-dom';

const ModifierPage = () => {
  const { id: modifierId } = useParams<{ id: string }>();
  const { data: modifier, isLoading, isError } = useGetModifierQuery(modifierId || '', { skip: !modifierId });
  if (!modifierId) {
    return null; // Handle the case where modifierId is not provided
  }

  return (
    <>
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error loading modifier.</p>}
      {!isLoading && !isError && modifier && !isMessage(modifier) && (
        <div>
          <Flex gap="md" align="center" mt="sm" mb="md">
            <BackButton back={CRoutes.modifiers} />
            <h1>Modifier: {modifier.name}</h1>
          </Flex>
          <p>Name: {modifier.name}</p>
          {/* Add more details as needed */}
        </div>
      )}
    </>
  );
};

export default ModifierPage;
