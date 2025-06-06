import { CRoutes } from '@app/routes.const';
import { RootState } from '@app/store';
import { IUserToken } from '@models/user.dto';
import { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const base = import.meta.env.VITE_BASE_URL;
  const { checkout } = useSelector((store: RootState) => store.checkout);
  const { user }: { user: IUserToken | undefined } = useSelector((store: RootState) => store.user);

  if (!user) {
    return <Navigate to={`${base}${checkout?.checkoutUrl}/${CRoutes.login}`} />;
  }

  return children;
};

export default ProtectedRoute;
