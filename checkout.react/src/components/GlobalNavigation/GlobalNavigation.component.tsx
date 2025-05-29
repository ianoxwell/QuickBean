import { useAppDispatch, useAppSelector } from '@app/hooks';
import { CRoutes } from '@app/routes.const';
import { RootState } from '@app/store';
import { logoutUser } from '@pages/account/userSlice';
import { Calendar, CircleUser, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './GlobalNavigation.component.scss';

export const GlobalNavigation = () => {
  const [navigation] = useState(links);
  const fillColor = '#128758';
  const iconSize = 24;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  // const { user } = useAppSelector((store: RootState) => store.user.user) as IUserToken;
  const { checkout } = useAppSelector((store: RootState) => store.checkout);

  const navigateSettings = () => {
    navigate(`/${checkout?.checkoutUrl}/${CRoutes.orders}`);
  };

  const logUserOut = () => {
    dispatch(logoutUser());
  };

  return (
    <>
      <nav className="bottom-nav">
        <NavLink to={CRoutes.menu} aria-label="Menu" className="nav-item">
          {({ isActive }) => {
            return <LayoutDashboard fill={isActive ? fillColor : 'white'} size={iconSize} />;
          }}
        </NavLink>
        {/* TODO add awareness of number of items in cart - on selection to show modal from bottom of cart */}
        <NavLink to={CRoutes.cart} aria-label="Cart" className="nav-item">
          {({ isActive }) => {
            return <Calendar fill={isActive ? fillColor : 'white'} size={iconSize} />;
          }}
        </NavLink>
        {/* TODO make popup and aware if logged in - includes logout */}
        <NavLink to={CRoutes.account} aria-label="Profile" className="nav-item">
          {({ isActive }) => {
            return <CircleUser fill={isActive ? fillColor : 'white'} size={iconSize} />;
          }}
        </NavLink>
      </nav>
    </>
  );
};
