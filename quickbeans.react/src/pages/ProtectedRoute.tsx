import { useGetVenueFullMutation, useGetVenueShortQuery } from '@app/apiSlice';
import { useAppDispatch } from '@app/hooks';
import { CRoutes } from '@app/routes.const';
import { RootState } from '@app/store';
import { setFullVenue } from '@app/venueSlice';
import { IUserToken } from '@models/user.dto';
import { isMessage } from '@utils/typescriptHelpers';
import { ReactNode, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const base = import.meta.env.VITE_BASE_URL;
  const { venueSlug } = useParams<{ venueSlug: string }>();
  const { data: venue, isLoading: isVenueLoading } = useGetVenueShortQuery(venueSlug || '');
  const venueState = useSelector((store: RootState) => store.venue);
  const { user: userToken }: { user: IUserToken | undefined } = useSelector((store: RootState) => store.user);
  const [getFullVenue, { isLoading: isFullVenueLoading }] = useGetVenueFullMutation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const defaultVenue: string = venue?.slug || venueSlug || import.meta.env.VITE_DEFAULT_VENUE;

  useEffect(() => {
    async function fetchFullVenue() {
      const fullVenue = await getFullVenue({
        venueId: venue?.id || venueState.id,
        userId: userToken?.user.id || 0
      }).unwrap();
      if (isMessage(fullVenue)) {
        console.error('Error fetching full venue:', fullVenue);
        navigate(`${base}${CRoutes.error}`);
        return;
      }
      dispatch(setFullVenue(fullVenue));
    }

    if (!userToken || !userToken.token) {
      console.log('User is not authenticated, redirecting to login');
      navigate(`${base}${defaultVenue}/${CRoutes.login}`);
      return;
    }

    if (isVenueLoading || isFullVenueLoading) {
      console.log('Venue is loading, waiting for full venue');
      return;
    }

    if ((!venueState.venue || !venueState.id) && !!venue?.id) {
      console.log('Venue not loaded, fetching full venue details', venueState, venue);
      fetchFullVenue();
    }
  }, [
    base,
    defaultVenue,
    venueSlug,
    isFullVenueLoading,
    isVenueLoading,
    userToken,
    venue,
    venueState,
    dispatch,
    getFullVenue,
    navigate
  ]);

  if (isVenueLoading || isFullVenueLoading || !venueState.venue) {
    return null;
  }

  return children;
};

export default ProtectedRoute;
