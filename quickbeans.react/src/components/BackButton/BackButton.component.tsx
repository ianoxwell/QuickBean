import { CRoutes } from '@app/routes.const';
import { useVenueNavigate } from '@app/useVenueNavigate';
import { ActionIcon } from '@mantine/core';
import { CornerDownLeft } from 'lucide-react';

const BackButton = ({ back }: { back: (typeof CRoutes)[keyof typeof CRoutes] }) => {
  const venueNavigate = useVenueNavigate();
  const iconSize = 20;

  return (
    <ActionIcon
      type="button"
      variant="default"
      radius="xl"
      size="lg"
      aria-label="Back"
      onClick={() => venueNavigate(back)}
    >
      <CornerDownLeft size={iconSize} />
    </ActionIcon>
  );
};

export default BackButton;
