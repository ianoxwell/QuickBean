import { useGetCheckoutQuery } from '@app/apiSlice';
import { isMessage } from '@utils/typescriptHelpers';
import { Outlet, useParams } from 'react-router-dom';

const SharedLayout = () => {
  const { venueSlug, checkoutSlug } = useParams<{ venueSlug: string; checkoutSlug: string }>();
  const { data, isLoading } = useGetCheckoutQuery({ slug: checkoutSlug || '', venueSlug: venueSlug || '' });

  return (
    <main>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          {!data || isMessage(data) ? (
            <div>Error {data?.message}</div>
          ) : (
            <>
              <h1>{data.name}</h1>
              <section className="main-content">
                <Outlet />
              </section>
            </>
          )}
        </>
      )}
    </main>
  );
};

export default SharedLayout;
