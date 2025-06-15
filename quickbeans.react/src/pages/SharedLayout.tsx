import { useGetVenueShortQuery } from '@app/apiSlice';
import Navbar from '@components/Navbar/Navbar';
import { AppShell, Burger, Group, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Outlet, useParams } from 'react-router-dom';

const SharedLayout = () => {
  const { venueSlug } = useParams<{ venueSlug: string }>();
  const { data: venue, isLoading } = useGetVenueShortQuery(venueSlug || '');
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: { base: 60, sm: 0 } }}
      navbar={{
        width: { base: 56, md: 180 },
        breakpoint: 'sm',
        collapsed: { mobile: !opened }
      }}
      padding="md"
    >
      <AppShell.Header hiddenFrom="sm">
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Title order={1} className="header-title">
            {venue?.name || 'QuickBeans'}
          </Title>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p={0}>
        <Navbar />
      </AppShell.Navbar>
      <AppShell.Main>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <section className="main-content">
            <Outlet />
          </section>
        )}
      </AppShell.Main>
    </AppShell>
  );
};

export default SharedLayout;
