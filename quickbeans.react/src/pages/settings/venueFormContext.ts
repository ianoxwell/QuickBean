import { createFormContext } from '@mantine/form';
import { IVenue } from '@models/venue.dto';

export const [VenueFormProvider, useVenueFormContext, useVenueForm] = createFormContext<IVenue>();
