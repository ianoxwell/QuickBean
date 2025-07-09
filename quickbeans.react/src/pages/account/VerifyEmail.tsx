import { useGetVenueShortQuery, useLazyGetVenueFullQuery, useVerifyOneTimeCodeMutation } from '@app/apiSlice';
import { useAppDispatch } from '@app/hooks';
import { CRoutes } from '@app/routes.const';
import { RootState } from '@app/store';
import { useVenueNavigate } from '@app/useVenueNavigate';
import { setFullVenue } from '@app/venueSlice';
import CountdownTimer from '@components/CountdownTimer/CountdownTime';
import { ActionIcon, Button, Card, Group, PinInput, Space, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { ERole } from '@models/base.dto';
import { IMessage } from '@models/message.dto';
import { IUserToken } from '@models/user.dto';
import { isMessage } from '@utils/typescriptHelpers';
import { CornerDownLeft } from 'lucide-react';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import './register.scss';
import { setUser } from './userSlice';

const VerifyEmail = () => {
  const [verifyUserEmail, { data: user, isLoading: isEmailLoading }] = useVerifyOneTimeCodeMutation();
  const [getFullVenue, { isLoading: isVenueLoading }] = useLazyGetVenueFullQuery();
  const venueState = useSelector((store: RootState) => store.venue);
  const isLoading = useMemo(() => isEmailLoading || isVenueLoading, [isEmailLoading, isVenueLoading]);
  const dispatch = useAppDispatch();
  const navigate = useVenueNavigate();
  const location = useLocation();
  const { email, oneTimeCode, expires } = location.state || {};
  const { venueSlug } = useParams<{ venueSlug: string }>();
  const { data: venue } = useGetVenueShortQuery(venueSlug || '');

  const initialState = {
    oneTimeCode: oneTimeCode || '142142'
  };

  const form = useForm({
    mode: 'uncontrolled', // more performant - https://mantine.dev/form/uncontrolled/
    validateInputOnChange: true,
    initialValues: initialState,
    validate: {
      oneTimeCode: (tos) => (tos || tos.length !== 6 ? null : 'Required for business')
    }
  });

  const verifyPinCode = async () => {
    const { oneTimeCode } = form.getValues();
    if (email && oneTimeCode) {
      try {
        const userToken: IUserToken | IMessage = await verifyUserEmail({ email, oneTimeCode }).unwrap();
        if (isMessage(userToken)) {
          // Handle the message case
          console.error('Error:', userToken.message);
          notifications.show({ message: userToken.message, color: 'red' });
        } else {
          // Successfully verified user
          notifications.show({ message: 'Successfully verified OTC', color: 'green' });
          dispatch(setUser(userToken)); // Assuming you have a setUser action to update the user state
          const venue = await getFullVenue(venueState.venue?.id || 0).unwrap();
          dispatch(setFullVenue(venue));
          const checkoutUrl = userToken.user.roles.includes(ERole.KITCHEN) ? CRoutes.kitchen : CRoutes.dashboard;
          navigate(checkoutUrl);
        }
      } catch (error) {
        console.error('Error verifying one-time code:', error);
        if (typeof error === 'object' && error !== null && 'message' in error) {
          // Handle the error message
          console.error((error as { message: string }).message);
          notifications.show({ message: (error as { message: string }).message, color: 'red' });
        }
      }
    }
  };

  return (
    <>
      {(() => {
        if (!user) {
          return (
            <main className="account-wrapper">
              <section className="login-section">
                <Group gap="md" align="center">
                  <ActionIcon
                    type="button"
                    radius="xl"
                    variant="default"
                    size="lg"
                    onClick={() => navigate(CRoutes.login)}
                    title="Back to login"
                  >
                    <CornerDownLeft size={16} />
                  </ActionIcon>
                  <Title order={1} className="login-title">
                    {venue?.name}
                  </Title>
                </Group>

                <Card className="action-card" shadow="xs" withBorder radius="md" padding="lg">
                  <h2>One time login code</h2>
                  <Space h="md" />
                  {expires && (
                    <div style={{ marginBottom: 16 }}>
                      <CountdownTimer expires={expires} onExpired={() => navigate(CRoutes.login)} />
                    </div>
                  )}
                  <form>
                    <PinInput
                      type={/^[0-9]*$/}
                      oneTimeCode
                      length={6}
                      key={form.key('oneTimeCode')}
                      {...form.getInputProps('oneTimeCode')}
                    />
                    <Space h="md" />
                    <Button type="button" onClick={verifyPinCode} fullWidth mt="md" radius="md" loading={isLoading}>
                      Verify
                    </Button>
                  </form>
                </Card>
              </section>
            </main>
          );
        } else if (isMessage(user)) {
          return (
            <>
              <h1>Oops something went wrong</h1>
              <p>{user.message}</p>
            </>
          );
        }

        return (
          <>
            <h1>Success</h1>
            <p>Welcome {user?.user.name} - logging you straight in now</p>
          </>
        );
      })()}
    </>
  );
};

export default VerifyEmail;
