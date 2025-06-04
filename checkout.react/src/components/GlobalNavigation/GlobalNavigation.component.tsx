import { useAppDispatch, useAppSelector } from '@app/hooks';
import { CRoutes } from '@app/routes.const';
import { RootState } from '@app/store';
import { Indicator, Menu, useMantineColorScheme } from '@mantine/core';
import { logoutUser } from '@pages/account/userSlice';
import { CircleUser, LayoutDashboard, LogIn, LogOut, Moon, ShoppingCart, Sun } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import './GlobalNavigation.component.scss';

export const GlobalNavigation = () => {
  const base = import.meta.env.VITE_BASE_URL;
  const fillColor = '#128758';
  const iconSize = 24;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  // const { user } = useAppSelector((store: RootState) => store.user.user) as IUserToken;
  const { checkout } = useAppSelector((store: RootState) => store.checkout);
  const { itemCount } = useAppSelector((store: RootState) => store.order);
  const { user } = useAppSelector((store: RootState) => store.user);
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  const navigateSettings = () => {
    navigate(`${base}${checkout?.checkoutUrl}/${CRoutes.orders}`);
  };

  const logUserOut = () => {
    dispatch(logoutUser());
  };

  const logUserIn = () => {
    navigate(`${base}${checkout?.checkoutUrl}/${CRoutes.login}`);
  };

  return (
    <>
      <nav aria-label="Quickbeans navigation" className="bottom-nav">
        <NavLink to={CRoutes.menu} aria-label="Menu" className="nav-item">
          {({ isActive }) => {
            return <LayoutDashboard fill={isActive ? fillColor : 'white'} size={iconSize} />;
          }}
        </NavLink>
        {/* TODO add awareness of number of items in cart - on selection to show modal from bottom of cart */}
        <NavLink to={CRoutes.cart} aria-label="Cart" className="nav-item">
          {({ isActive }) => {
            return itemCount ? (
              <Indicator
                size={16}
                label={itemCount}
                inline
                position="top-end"
                color="red"
                style={{ '--indicator-translate-y': '40%', '--indicator-translate-x': '70%' }}
              >
                <ShoppingCart fill={isActive ? fillColor : 'white'} size={iconSize} />
              </Indicator>
            ) : (
              <ShoppingCart fill={isActive ? fillColor : 'white'} size={iconSize} />
            );
          }}
        </NavLink>
        {/* TODO make popup and aware if logged in - includes logout */}
        <Menu width={200}>
          <Menu.Target>
            <NavLink to="#no-where" aria-label="Profile" className="nav-item">
              {({ isActive }) => {
                return <CircleUser fill={isActive ? fillColor : 'white'} size={iconSize} />;
              }}
            </NavLink>
          </Menu.Target>

          <Menu.Dropdown>
            {!!user && (
              <Menu.Item onClick={navigateSettings} leftSection={<LayoutDashboard size={iconSize} />}>
                Past Orders
              </Menu.Item>
            )}
            <Menu.Item
              onClick={() => setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')}
              leftSection={colorScheme === 'dark' ? <Sun size={iconSize} /> : <Moon size={iconSize} />}
            >
              Toggle color scheme
            </Menu.Item>
            <Menu.Divider />
            {user ? (
              <Menu.Item onClick={logUserOut} leftSection={<LogOut size={iconSize} />}>
                Logout
              </Menu.Item>
            ) : (
              <Menu.Item onClick={logUserIn} leftSection={<LogIn size={iconSize} />}>
                Login
              </Menu.Item>
            )}
          </Menu.Dropdown>
        </Menu>
      </nav>
    </>
  );
};
