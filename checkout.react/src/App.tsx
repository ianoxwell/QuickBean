import { CRoutes } from '@app/routes.const';
import { createTheme, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';
import Login from '@pages/account/Login';
import VerifyEmail from '@pages/account/VerifyEmail';
import ConfirmationPage from '@pages/confirmation/ConfirmationPage';
import MenuPage from '@pages/menu/MenuPage';
import MenuItemModal from '@pages/menu/MenuItemModal';
import OrderCartPage from '@pages/order/OrderCartPage';
import PaymentPage from '@pages/payment/PaymentPage';
import ProtectedRoute from '@pages/ProtectedRoute';
import SharedLayout from '@pages/SharedLayout';
import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setPreviewCheckoutData } from './pages/checkoutSlice';
import './App.scss';

const theme = createTheme({
  fontFamily: 'Lato, Quicksand, sans-serif',
  breakpoints: {
    xs: '37em',
    sm: '48em',
    md: '68em',
    lg: '80em',
    xl: '125em',
  },
});

function App() {
  const defaultVenue: string = import.meta.env.VITE_DEFAULT_VENUE;
  const defaultCheckout: string = import.meta.env.VITE_DEFAULT_CHECKOUT;
  const location = useLocation();
  const dispatch = useDispatch();

  const isPreviewMode = new URLSearchParams(location.search).get('previewMode') === 'true';

  useEffect(() => {
    if (isPreviewMode) {
      console.log('Preview mode is enabled. Listening for messages from quickbeans.react...');
      
      const handleMessage = (event: MessageEvent) => {
        // Ensure the message is from a trusted origin and is the type we expect
        if (
          event.origin === 'http://localhost:3000' && // Replace with your quickbeans.react origin
          event.data &&
          event.data.type === 'UPDATE_CHECKOUT_PREVIEW'
        ) {
          console.log('Received preview checkout data:', event.data.payload);
          
          dispatch(setPreviewCheckoutData(event.data.payload));
        }
      };

      window.addEventListener('message', handleMessage);

      return () => {
        window.removeEventListener('message', handleMessage);
      };
    }
  }, [isPreviewMode, dispatch]);

  return (
    <>
      <MantineProvider defaultColorScheme="auto" theme={theme}>
        <Notifications position="top-center" color="accent" limit={5} autoClose={6000} zIndex={1001} />
        {/* Note guide to mantine notifications - https://mantine.dev/x/notifications/#functions */}
        <ModalsProvider>
          <Routes>
            {/* Redirect '/' to a default venueSlug/checkoutSlug */}
            <Route
              path="/"
              element={
                <Navigate to={`/${defaultVenue}/${defaultCheckout}/${CRoutes.menu}`} replace />
              }
            />
            <Route path="/:venueSlug/:checkoutSlug" element={<SharedLayout />}>
              {/* Unprotected routes */}
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
              {isPreviewMode ? (
                <Route path="*" element={<Navigate to={CRoutes.menu} replace />} />
              ) : (
                <>
                  <Route path={CRoutes.cart} element={<OrderCartPage />} />
                  <Route path={CRoutes.login} element={<Login />} />
                  <Route path={CRoutes.verify} element={<VerifyEmail />} />

                  {/* Protected routes */}
                  <Route
                    path={CRoutes.payment}
                    element={
                      <ProtectedRoute>
                        <PaymentPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path={`${CRoutes.confirmation}/:receiptNumber`}
                    element={
                      <ProtectedRoute>
                        <ConfirmationPage />
                      </ProtectedRoute>
                    }
                  />
                </>
              )}
            </Route>
          </Routes>
        </ModalsProvider>
      </MantineProvider>
    </>
  );
}

export default App;
