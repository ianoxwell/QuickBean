import { useGetCheckoutQuery } from '@app/apiSlice';
import { GlobalNavigation } from '@components/GlobalNavigation/GlobalNavigation.component';
import HeroImage from '@components/HeroImage/HeroImage';
import { isMessage } from '@utils/typescriptHelpers';
import { Outlet, useParams, useLocation } from 'react-router-dom';

const SharedLayout = () => {
  const { venueSlug, checkoutSlug } = useParams<{ venueSlug: string; checkoutSlug: string }>();
  const { data, isLoading } = useGetCheckoutQuery({ slug: checkoutSlug || '', venueSlug: venueSlug || '' });
  const location = useLocation();
  const isPreviewMode = new URLSearchParams(location.search).get('previewMode') === 'true';

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
              {!isPreviewMode && <GlobalNavigation />}
              <HeroImage />
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
