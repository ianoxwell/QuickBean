import { useGetActiveProductsQuery } from '@app/apiSlice';
import { CRoutes } from '@app/routes.const';
import { RootState } from '@app/store';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const ProductsPage = () => {
  const base = import.meta.env.VITE_BASE_URL;
  const venueState = useSelector((store: RootState) => store.venue);
  const {
    data: products,
    isLoading,
    isError
  } = useGetActiveProductsQuery(venueState.id, {
    skip: !venueState.id
  });

  return (
    <div>
      <h1>List of Products</h1>
      {isLoading && <p>Loading...</p>}
      {isError && <p>Error loading products.</p>}
      {products && (
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              <Link to={`${base}${venueState.slug}/${CRoutes.products}/${product.id}`}>{product.name}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductsPage;

