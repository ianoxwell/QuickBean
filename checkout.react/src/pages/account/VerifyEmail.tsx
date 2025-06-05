import { useVerifyOneTimeCodeMutation } from '@app/apiSlice';
import { useAppDispatch } from '@app/hooks';
import { CRoutes } from '@app/routes.const';
import { RootState } from '@app/store';
import { Button, PinInput, Space } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IMessage } from '@models/message.dto';
import { IUserToken } from '@models/user.dto';
import { isMessage } from '@utils/typescriptHelpers';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { setUser } from './userSlice';

const initialState = {
  oneTimeCode: '142142'
};

const VerifyEmail = () => {
  const base = import.meta.env.VITE_BASE_URL;
  const [verifyUserEmail, { data: user, isLoading }] = useVerifyOneTimeCodeMutation();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { email, order } = location.state || {};
  const { checkout } = useSelector((store: RootState) => store.checkout);

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
          console.log('User verified successfully:', userToken);
          notifications.show({ message: 'Successfully verified OTC', color: 'green' });
          dispatch(setUser(userToken)); // Assuming you have a setUser action to update the user state
          // You can redirect or update the state as needed
          const checkoutUrl = order
            ? `${base}${checkout?.checkoutUrl}/${CRoutes.payment}`
            : `${base}${checkout?.checkoutUrl}/${CRoutes.menu}`;
          navigate(checkoutUrl, { state: { order } });
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
            <>
              <h1>One time login code</h1>
              <Space h="md" />
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
            </>
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
