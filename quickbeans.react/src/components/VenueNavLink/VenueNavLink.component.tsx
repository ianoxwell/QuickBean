import { RootState } from '@app/store';
import { Text } from '@mantine/core';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

const VenueNavLink = ({ path, label, description, className }: { path: string; label: string; description?: string; className?: string }) => {
  const venueSlug = useSelector((state: RootState) => state.venue.slug);
  const base = import.meta.env.VITE_BASE_URL || '';
  const defaultVenue = import.meta.env.VITE_DEFAULT_VENUE || '';
  const fullPath = `${base}${venueSlug || defaultVenue}${path.startsWith('/') ? path : `/${path}`}`;

  return (
    <NavLink to={fullPath} className={`navigation-item ${className}`}>
      <Text >{label}</Text>
      {description && <Text className="description" size='sm' c="dimmed">{description}</Text>}
    </NavLink>
  );
};

export default VenueNavLink;
