import { useLoginUserMutation } from '@app/apiSlice';
import { useAppSelector } from '@app/hooks';
import { CRoutes } from '@app/routes.const';
import { RootState } from '@app/store';
import { Button, Checkbox, Group, TextInput } from '@mantine/core';
import { isEmail, useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { ERole } from '@models/base.dto';
import { IOrder } from '@models/order.dto';
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
  const [registerUser, { isLoading }] = useLoginUserMutation();

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
      await registerUser({ email, loginProvider: 'local', roles: [ERole.PATRON] }).unwrap();
      // navigate to the one time code verification page
      navigate(`${base}${checkout?.checkoutUrl}/${CRoutes.verify}`, { state: { email, order } });
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
      <h2>Sign in or sign up</h2>
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
    </>
  );
};

export default Login;
