import { colorsTuple, createTheme, MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { Routes } from 'react-router-dom';
import './App.scss';

const theme = createTheme({
  fontFamily: 'Quicksand, sans-serif',
  primaryColor: 'accent',
  colors: {
    accent: colorsTuple('#128758')
  },
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

  return (
    <>
      <MantineProvider theme={theme}>
        <Notifications position="top-center" color="accent" limit={5} autoClose={6000} zIndex={1001} />
        {/* Note guide to mantine notifications - https://mantine.dev/x/notifications/#functions */}
        <ModalsProvider>
          <h1>Quickbeans admin</h1>
          <div>URL - {base}</div>
          <Routes></Routes>
        </ModalsProvider>
      </MantineProvider>
    </>
  );
}

export default App;
