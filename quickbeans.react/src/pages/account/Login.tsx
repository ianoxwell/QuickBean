import { useGetVenueShortQuery, useLazyLoginExistingUserQuery } from '@app/apiSlice';
import { useAppSelector } from '@app/hooks';
import { CRoutes } from '@app/routes.const';
import { RootState } from '@app/store';
import { Button, Card, Group, Stack, TextInput } from '@mantine/core';
import { isEmail, useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { ERole } from '@models/base.dto';
import { isMessage } from '@utils/typescriptHelpers';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './register.scss';
import { useVenueNavigate } from '@app/useVenueNavigate';

const initialState = {
  email: 'front@coffee.com'
};

const Login = () => {
  const { user, defaultRoute } = useAppSelector((store: RootState) => store.user);
  const navigate = useVenueNavigate();
  const [loginExistingUser, { isLoading }] = useLazyLoginExistingUserQuery();
  const { venueSlug } = useParams<{ venueSlug: string }>();
  const { data: venue, isLoading: isLoadingVenue } = useGetVenueShortQuery(venueSlug || '');

  const form = useForm({
    mode: 'uncontrolled', // more performant - https://mantine.dev/form/uncontrolled/
    validateInputOnChange: true,
    initialValues: initialState,
    validate: {
      email: isEmail('Invalid email')
    }
  });

  const submitButton = async () => {
    form.validate();
    if (!form.isValid()) {
      return;
    }

    const { email } = form.getValues();
    try {
      const credential = await loginExistingUser(email).unwrap();
      if (!isMessage(credential)) {
        const { oneTimeCode, expires } = credential;
        navigate(`${CRoutes.verify}`, { state: { email, oneTimeCode, expires } });
      }
      // navigate to the one time code verification page
    } catch (error) {
      console.log('Looks like a massive mistake happened', error);
      if (typeof error === 'object' && error !== null && 'message' in error) {
        notifications.show({ message: (error as { message: string }).message, color: 'red' });
      }
    }
  };

  const onChangeDefaultEmail = (email: string) => {
    form.setFieldValue('email', email);
  };

  useEffect(() => {
    if (user) {
      let venueUrl = defaultRoute;
      if (!venueUrl || venueUrl === CRoutes.login) {
        // If the user has no default route, set it based on their roles
        venueUrl = CRoutes.kitchen;
        if (user.user?.roles && user.user.roles.length > 0 && !user.user.roles.includes(ERole.KITCHEN)) {
          venueUrl = CRoutes.dashboard;
        }
      }

      // If the user is already logged in, redirect them to the payment or the previous page
      console.log('Redirecting to:', venueUrl);
      navigate(venueUrl, { replace: true });
    }
  }, [user, defaultRoute, navigate]);

  if (user) {
    return null;
  }

  return (
    <main className="account-wrapper">
      {isLoadingVenue ? (
        <div>Loading...</div>
      ) : (
        <>
          <section className="login-section">
            <h1>{venue?.name}</h1>
            <Card className="action-card" shadow="xs" withBorder radius="md" padding="lg">
              <h2>Sign in with existing account</h2>
              <form>
                <TextInput
                  withAsterisk
                  required
                  label="Email"
                  type="email"
                  placeholder="your@email.com"
                  autoComplete="email"
                  key={form.key('email')}
                  {...form.getInputProps('email')}
                />

                <Group justify="flex-end" mt="md">
                  <Button type="button" onClick={submitButton} fullWidth mt="md" loading={isLoading}>
                    Submit
                  </Button>
                </Group>
              </form>
            </Card>
          </section>
          <section className="splash-section">
            <Stack align="center" gap="lg" mt="xl" mb="xl">
              <h2>Demonstration purposes only</h2>
              <Button type="button" variant="default" onClick={() => onChangeDefaultEmail('front@coffee.com')}>
                Login as Front of house Frank (Serving staff)
              </Button>
              <Button type="button" variant="default" onClick={() => onChangeDefaultEmail('bob@coffee.com')}>
                Login as Bob Barista (Kitchen)
              </Button>
              <Button type="button" variant="default" onClick={() => onChangeDefaultEmail('admin@coffee.com')}>
                Login as Alice Admin (Admin)
              </Button>
            </Stack>
          </section>
        </>
      )}
    </main>
  );
};

export default Login;
