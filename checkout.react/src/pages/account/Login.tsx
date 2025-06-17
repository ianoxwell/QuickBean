import { useLazyLoginExistingUserQuery } from '@app/apiSlice';
import { useAppSelector } from '@app/hooks';
import { CRoutes } from '@app/routes.const';
import { RootState } from '@app/store';
import { Button, Card, Checkbox, Group, Space, Stack, TextInput } from '@mantine/core';
import { isEmail, useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IOrder } from '@models/order.dto';
import { isMessage } from '@utils/typescriptHelpers';
import { useLocation, useNavigate } from 'react-router-dom';

const initialState = {
  email: 'patron@coffee.com',
  termsOfService: true
};

const Login = () => {
  const base = import.meta.env.VITE_BASE_URL;
  const { user } = useAppSelector((store: RootState) => store.user);
  const { checkout } = useAppSelector((store: RootState) => store.checkout);
  const navigate = useNavigate();
  const [logonUser, { isLoading }] = useLazyLoginExistingUserQuery();

  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  const { order }: { order: IOrder | null } = location.state ?? { order: null };

  const submitButton = async () => {
    form.validate();
    if (!form.isValid()) {
      return;
    }

    const { email } = form.getValues();
    try {
      const result = await logonUser(email).unwrap();
      if (isMessage(result)) {
        // Handle the message case
        console.error('Error:', result.message);
        notifications.show({ message: result.message, color: 'red' });
        return;
      }

      // navigate to the one time code verification page
      navigate(`${base}${checkout?.checkoutUrl}/${CRoutes.verify}`, {
        state: { email, order, code: result.oneTimeCode }
      });
    } catch (error) {
      console.log('Looks like a massive mistake happened', error);
      if (typeof error === 'object' && error !== null && 'message' in error) {
        notifications.show({ message: (error as { message: string }).message, color: 'red' });
      }
    }
  };

  const form = useForm({
    mode: 'uncontrolled', // more performant - https://mantine.dev/form/uncontrolled/
    validateInputOnChange: true,
    initialValues: initialState,
    validate: {
      email: isEmail('Invalid email'),
      termsOfService: (tos) => (tos ? null : 'Required for business')
    }
  });

  if (user) {
    const checkoutUrl = order ? `${base}${checkout?.checkoutUrl}/${CRoutes.payment}` : from;
    // If the user is already logged in, redirect them to the payment or the previous page
    navigate(checkoutUrl, { replace: true });
    return null;
  }

  return (
    <>
      <Card shadow="sm" padding="lg" radius="md" withBorder>
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

          <Checkbox
            mt="md"
            label="I agree to sell my privacy"
            key={form.key('termsOfService')}
            {...form.getInputProps('termsOfService', { type: 'checkbox' })}
          />

          <Group justify="flex-end" mt="md">
            <Button type="button" onClick={submitButton} fullWidth mt="md" radius="md" loading={isLoading}>
              Submit
            </Button>
          </Group>
        </form>
      </Card>
      <Card shadow="sm" padding="lg" radius="md" mt="xl" withBorder>
        <h2>Demo purpose only try one of these existing accounts</h2>
        <Stack gap="md" mt="md">
          <Button type="button" onClick={() => form.setFieldValue('email', 'patron@coffee.com')}>
            Login as Patty Patron
          </Button>
          <Button type="button" onClick={() => form.setFieldValue('email', 'professor@coffee.com')}>
            Login as Professor Patron
          </Button>
          <Button type="button" onClick={() => form.setFieldValue('email', 'sally@coffee.com')}>
            Login as Sally Patron
          </Button>
        </Stack>
      </Card>
    </>
  );
};

export default Login;
