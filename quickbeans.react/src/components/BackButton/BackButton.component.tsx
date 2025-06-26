import { CIconSizes } from '@app/appGlobal.const';
import { CRoutes } from '@app/routes.const';
import { useVenueNavigate } from '@app/useVenueNavigate';
import { ActionIcon } from '@mantine/core';
import { CornerDownLeft } from 'lucide-react';

const BackButton = ({ back }: { back: (typeof CRoutes)[keyof typeof CRoutes] }) => {
  const venueNavigate = useVenueNavigate();

  return (
    <ActionIcon
      type="button"
      variant="default"
      radius="xl"
      size="lg"
      aria-label="Back"
      onClick={() => venueNavigate(back)}
    >
      <CornerDownLeft size={CIconSizes.large} />
    </ActionIcon>
  );
};

export default BackButton;
