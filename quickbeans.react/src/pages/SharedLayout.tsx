import { useGetVenueShortQuery } from '@app/apiSlice';
import { Outlet, useParams } from 'react-router-dom';

const SharedLayout = () => {
  const { venueSlug } = useParams<{ venueSlug: string }>();
  const { data: venue, isLoading } = useGetVenueShortQuery(venueSlug || '');

  return (
    <main>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <h1>
            {venueSlug} - {venue?.name}
          </h1>
          <section className="main-content">
            <Outlet />
          </section>
        </>
      )}
    </main>
  );
};

export default SharedLayout;
