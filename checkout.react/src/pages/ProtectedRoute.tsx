import { CRoutes } from '@app/routes.const';
import { RootState } from '@app/store';
import { useCheckoutNavigate } from '@app/useCheckoutNavigate';
import { IUserToken } from '@models/user.dto';
import { ReactNode, useEffect } from 'react';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const base = import.meta.env.VITE_BASE_URL;
  const { checkout } = useSelector((store: RootState) => store.checkout);
  const { user }: { user: IUserToken | undefined } = useSelector((store: RootState) => store.user);
  const navigate = useCheckoutNavigate();

  useEffect(() => {
    // If the user is not logged in, redirect to login page
    if (!user) {
      navigate(CRoutes.login);
      return;
    }
  }, [user, navigate, base, checkout]);

  return children;
};

export default ProtectedRoute;
