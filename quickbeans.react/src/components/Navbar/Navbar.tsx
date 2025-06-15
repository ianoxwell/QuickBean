import { useAppDispatch, useAppSelector } from '@app/hooks';
import { CRoutes } from '@app/routes.const';
import { Divider, Flex, Menu, Stack, Text, Title, useMantineColorScheme } from '@mantine/core';
import { ERole } from '@models/base.dto';
import { logoutUser } from '@pages/account/userSlice';
import { CircleUser, CookingPot, LayoutDashboard, LogOut, Moon, Settings, SquareMenu, Sun } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import './Navbar.scss';

const Navbar = () => {
  const { user } = useAppSelector((state) => state.user);
  const { venue } = useAppSelector((state) => state.venue);
  const iconSize = 20;
  const dispatch = useAppDispatch();
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  const navItems = [
    {
      label: 'Dashboard',
      icon: <LayoutDashboard size={iconSize} />,
      path: CRoutes.dashboard,
      isAllowed: user?.user.roles.includes(ERole.ADMIN) || user?.user.roles.includes(ERole.FRONT_OF_HOUSE)
    },
    {
      label: 'Kitchen',
      icon: <CookingPot size={iconSize} />,
      path: CRoutes.kitchen,
      isAllowed: true // Kitchen is always allowed
    },
    {
      label: 'Products',
      icon: <LayoutDashboard size={iconSize} />,
      path: CRoutes.products,
      isAllowed: user?.user.roles.includes(ERole.ADMIN) || user?.user.roles.includes(ERole.FRONT_OF_HOUSE)
    },
    {
      label: 'Checkouts',
      icon: <SquareMenu size={iconSize} />,
      path: CRoutes.checkouts,
      isAllowed: user?.user.roles.includes(ERole.ADMIN)
    },
    {
      label: 'Settings',
      icon: <Settings size={iconSize} />,
      path: CRoutes.settings,
      isAllowed: user?.user.roles.includes(ERole.ADMIN)
    }
  ];

  const logUserOut = () => {
    dispatch(logoutUser());
  };

  return (
    <Flex justify="space-between" direction="column" align="flex-start" className="navbar">
      <Stack className="navbar--items" justify="flex-start" align="stretch">
        <Title order={1} mb="lg" className="header-title" visibleFrom="md">
          {venue?.name || 'QuickBeans'}
        </Title>
        {navItems.map((item) => (
          <NavLink key={item.label} aria-label={item.label} to={item.path} className="nav-link">
            {item.icon}
            <Text visibleFrom="md">{item.label}</Text>
          </NavLink>
        ))}
      </Stack>
      <Stack className="navbar--items">
        <Divider />
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <NavLink to="#" aria-label="Profile" className="nav-user-menu">
              <CircleUser size={iconSize} />
              <Text visibleFrom="md">{user?.user?.name}</Text>
            </NavLink>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              onClick={() => setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')}
              leftSection={colorScheme === 'dark' ? <Sun size={iconSize} /> : <Moon size={iconSize} />}
            >
              Toggle color scheme
            </Menu.Item>
            <Menu.Item leftSection={<LogOut size={14} />} component="button" type="button" onClick={logUserOut}>
              Logout
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Stack>
    </Flex>
  );
};

export default Navbar;
