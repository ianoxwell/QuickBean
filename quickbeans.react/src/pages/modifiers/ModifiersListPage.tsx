import { useGetActiveModifiersQuery } from "@app/apiSlice";
import { CRoutes } from "@app/routes.const";
import { RootState } from "@app/store";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const ModifiersPage = () => {
  const base = import.meta.env.VITE_BASE_URL;
  const venueState = useSelector((store: RootState) => store.venue);
  const { data: modifiers, isLoading, isError } = useGetActiveModifiersQuery(venueState.id, {
    skip: !venueState.id
  });
  return (
    <>
      {isLoading && <div>Loading...</div>}
      {isError && <div>Error loading modifiers</div>}
      {!isLoading && !isError && modifiers && (
        <div>
          <h1>Modifiers List</h1>
          <ul>
            {modifiers.map((modifier) => (
              <li key={modifier.id}>
                <Link to={`${base}${venueState.slug}/${CRoutes.modifiers}/${modifier.id}`}>{modifier.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default ModifiersPage;
