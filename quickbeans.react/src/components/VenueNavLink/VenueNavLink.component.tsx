import { RootState } from '@app/store';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

const VenueNavLink = ({ path, label }: { path: string; label: string }) => {
  const venueSlug = useSelector((state: RootState) => state.venue.slug);
  const base = import.meta.env.VITE_BASE_URL || '';
  const defaultVenue = import.meta.env.VITE_DEFAULT_VENUE || '';
  const fullPath = `${base}${venueSlug || defaultVenue}${path.startsWith('/') ? path : `/${path}`}`;

  return (
    <NavLink to={fullPath} className="navigation-item">
      {label}
    </NavLink>
  );
};

export default VenueNavLink;
