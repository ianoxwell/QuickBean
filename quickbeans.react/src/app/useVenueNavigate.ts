/**
 * Custom hook that returns a navigation function scoped to the current venue.
 *
 * The returned `venueNavigate` function constructs a path that includes the venue slug
 * (from Redux state) and an optional base URL (from environment variables), then navigates
 * using React Router's `navigate` function.
 *
 * @example
 * const venueNavigate = useVenueNavigate();
 * venueNavigate('/checkout'); // Navigates to /your-base-url/your-venue-slug/checkout
 * venueNavigate('/checkout', { replace: true }); // Replaces the current entry in the history stack
 * venueNavigate('/checkout', { state: { from: 'somewhere' } }); // Navigates with state
 *
 * @returns {(path: string, options?: Parameters<typeof navigate>[1]) => void}
 *   A function to navigate to a path within the current venue context.
 */
import { useNavigate, NavigateOptions } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@app/store';

export function useVenueNavigate() {
  const navigate = useNavigate();
  const venueSlug = useSelector((state: RootState) => state.venue.slug);
  const base = import.meta.env.VITE_BASE_URL || '';
  const defaultVenue = import.meta.env.VITE_DEFAULT_VENUE || '';

  // Usage: venueNavigate('/checkout')
  function venueNavigate(path: string, options?: NavigateOptions) {
    // Ensure no double slashes
    const fullPath = `${base}${venueSlug || defaultVenue}${path.startsWith('/') ? path : `/${path}`}`;
    navigate(fullPath, options);
  }

  return venueNavigate;
}
