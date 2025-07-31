import { NavigateOptions, useNavigate } from 'react-router-dom';
import { useAppSelector } from './hooks';

export function useCheckoutNavigate() {
  const base = import.meta.env.VITE_BASE_URL;
  const defaultVenue: string = import.meta.env.VITE_DEFAULT_VENUE;
  const defaultCheckout: string = import.meta.env.VITE_DEFAULT_CHECKOUT;
  const navigate = useNavigate();
  const { checkout } = useAppSelector((state) => state.checkout);

  const checkoutNavigate = (path: string, options?: NavigateOptions) => {
    // Ensure no double slashes
    const defaultCheckoutUrl = `${defaultVenue}/${defaultCheckout}`;
    const fullPath = `${base}${checkout?.checkoutUrl || defaultCheckoutUrl}${path.startsWith('/') ? path : `/${path}`}`;
    if (checkout) {
      navigate(fullPath, options);
    } else {
      console.error(`Checkout is not defined. Cannot navigate to ${path}.`);
    }
  };

  return checkoutNavigate;
}
