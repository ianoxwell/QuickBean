import { useVerifyUserEmailMutation } from '@app/apiSlice';
import { Button } from '@mantine/core';
import { isMessage } from '@utils/typescriptHelpers';
import { useSearchParams } from 'react-router-dom';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  // const { user, isLoading, errorMessage } = useSelector((store: RootState) => store.user);
  const [verifyUserEmail, { data: user, isLoading }] = useVerifyUserEmailMutation();
  const email = searchParams.get('email');
  const token = searchParams.get('token');

  const verifyEmail = () => {
    if (email && token) {
      verifyUserEmail({ email, token });
    }
  };

  return (
    <>
      {(() => {
        if (!user) {
          return (
            <>
              <h1>Verifying email</h1>
              <p>Verify this email? {email}</p>
              <Button type="button" onClick={verifyEmail} fullWidth mt="md" radius="md" loading={isLoading}>
                Verify
              </Button>
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
