import { useGetActiveCheckoutsQuery } from '@app/apiSlice';
import { CRoutes } from '@app/routes.const';
import { RootState } from '@app/store';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const CheckoutsListPage = () => {
  const base = import.meta.env.VITE_BASE_URL;
  const venueState = useSelector((store: RootState) => store.venue);
  const { data: checkouts, isLoading, isError } = useGetActiveCheckoutsQuery(venueState.id);

  return (
    <>
      {isLoading && <div>Loading...</div>}
      {isError && <div>Error loading checkouts</div>}
      {!isLoading && !isError && checkouts && (
        <div>
          <h2>Checkouts List</h2>
          <ul>
            {checkouts.map((checkout) => (
              <li key={checkout.slug}>
                <Link to={`${base}${venueState.slug}/${CRoutes.checkouts}/${checkout.slug}`}>{checkout.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default CheckoutsListPage;
