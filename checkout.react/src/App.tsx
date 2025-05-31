import { CRoutes } from '@app/routes.const';
import { createTheme, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';
import AccountWrapper from '@pages/account/AccountWrapper';
import ForgotPassword from '@pages/account/ForgotPassword';
import Login from '@pages/account/Login';
import ResetPassword from '@pages/account/ResetPassword';
import VerifyEmail from '@pages/account/VerifyEmail';
import MenuItemModal from '@pages/menu/MenuItemModal';
import MenuPage from '@pages/menu/MenuPage';
import SharedLayout from '@pages/SharedLayout';
import { Navigate, Route, Routes } from 'react-router-dom';
import './App.scss';

const theme = createTheme({
  fontFamily: 'Lato, Quicksand, sans-serif',
  breakpoints: {
    xs: '37em',
    sm: '48em',
    md: '68em',
    lg: '80em',
    xl: '125em'
  }
});

function App() {
  const defaultVenue: string = import.meta.env.VITE_DEFAULT_VENUE;
  const defaultCheckout: string = import.meta.env.VITE_DEFAULT_CHECKOUT;

  return (
    <>
      <MantineProvider defaultColorScheme="auto" theme={theme}>
        <Notifications position="top-center" color="accent" limit={5} autoClose={6000} zIndex={1001} />
        {/* Note guide to mantine notifications - https://mantine.dev/x/notifications/#functions */}
        <ModalsProvider>
          <Routes>
            {/* Redirect '/' to a default venueSlug/checkoutSlug */}
            <Route path="/" element={<Navigate to={`/${defaultVenue}/${defaultCheckout}/${CRoutes.menu}`} replace />} />
            <Route path="/:venueSlug/:checkoutSlug" element={<SharedLayout />}>
              <Route path={CRoutes.menu} element={<MenuPage />} />
              <Route
                path={`${CRoutes.menu}/:id`}
                element={
                  <>
                    <MenuPage />
                    <MenuItemModal />
                  </>
                }
              />

              <Route path={CRoutes.account} element={<AccountWrapper />}>
                <Route path={CRoutes.login} element={<Login />} />
                <Route path={CRoutes.forgotPassword} element={<ForgotPassword />} />
                <Route path={CRoutes.verifyEmail} element={<VerifyEmail />} />
                <Route path={CRoutes.resetPassword} element={<ResetPassword />} />
              </Route>
            </Route>
          </Routes>
        </ModalsProvider>
      </MantineProvider>
    </>
  );
}

export default App;
