import { CRoutes } from '@app/routes.const';
import { createTheme, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';
import Login from '@pages/account/Login';
import VerifyEmail from '@pages/account/VerifyEmail';
import ProtectedRoute from '@pages/ProtectedRoute';
import SharedLayout from '@pages/SharedLayout';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
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
  const base = import.meta.env.VITE_BASE_URL;
  const defaultVenue: string = import.meta.env.VITE_DEFAULT_VENUE;

  return (
    <>
      <MantineProvider theme={theme}>
        <Notifications position="top-center" color="accent" limit={5} autoClose={6000} zIndex={1001} />
        {/* Note guide to mantine notifications - https://mantine.dev/x/notifications/#functions */}
        <ModalsProvider>
          <Routes>
            {/* Redirect '/' to a default venueSlug */}
            <Route path={base} element={<Navigate to={`${base}${defaultVenue}/${CRoutes.login}`} replace />} />
            <Route path={`${base}:venueSlug`} element={<Outlet />}>
              <Route
                path={`${base}:venueSlug`}
                element={
                  <ProtectedRoute>
                    <SharedLayout />
                  </ProtectedRoute>
                }
              >
                <Route path={CRoutes.dashboard} element={<div>Dashboard Page</div>} />
                <Route path={CRoutes.kitchen} element={<div>Kitchen Page</div>} />
                <Route path={CRoutes.products} element={<div>Products Page</div>} />
                <Route path={CRoutes.checkouts} element={<div>Checkouts Page</div>} />
                <Route path={CRoutes.settings} element={<div>Settings Page</div>} />
              </Route>
              <Route path={CRoutes.login} element={<Login />} />
              <Route path={CRoutes.verify} element={<VerifyEmail />} />
            </Route>
          </Routes>
        </ModalsProvider>
      </MantineProvider>
    </>
  );
}

export default App;
