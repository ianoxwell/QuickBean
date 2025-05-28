import { useLoginUserMutation, useRegisterUserMutation } from '@app/apiSlice';
import { useAppDispatch } from '@app/hooks';
import { CRoutes } from '@app/routes.const';
import { RootState } from '@app/store';
import { Button, Checkbox, Group, NavLink, TextInput, UnstyledButton } from '@mantine/core';
import { isEmail, isNotEmpty, useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { ERole } from '@models/base.dto';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { toggleIsMember } from './userSlice';

const initialState = {
  name: '',
  phone: '',
  email: 'testuser@noemail.com',
  password: 'testPassword',
  termsOfService: false
};

const Login = () => {
  const { isMember } = useSelector((store: RootState) => store.user);
  const dispatch = useAppDispatch();
  const [loginUser, { isLoading: isLoginLoading }] = useLoginUserMutation();
  const [registerUser, { isLoading: isRegisterLoading }] = useRegisterUserMutation();
  const isLoading = useMemo(() => isLoginLoading || isRegisterLoading, [isLoginLoading, isRegisterLoading]);

  const submitButton = async () => {
    form.validate();
    if (!form.isValid()) {
      return;
    }

    const { name, phone, email, password } = form.getValues();
    console.log('current form', form.getValues(), form.isValid(), form.errors);
    // Note to self the form.errors is usually blank if the form is not touched

    if (isMember) {
      try {
        await loginUser({ email, password }).unwrap();
      } catch (error: unknown) {
        console.log('Looks like a massive mistake happened', error);
        if (typeof error === 'object' && error !== null && 'message' in error) {
          notifications.show({ message: (error as { message: string }).message, color: 'red' });
        }
      }

      return;
    }

    registerUser({ name, phone, email, password, loginProvider: 'local', photoUrl: '', roles: [ERole.PATRON] });
  };

  const toggleMember = () => {
    dispatch(toggleIsMember());
  };

  const form = useForm({
    mode: 'uncontrolled', // more performant - https://mantine.dev/form/uncontrolled/
    validateInputOnChange: true,
    initialValues: initialState,
    validate: {
      name: (name) => (isMember || name.length > 2 ? null : 'Name needs to be longer than 3 characters'),
      phone: (phone) => (isMember || phone.length > 7 ? null : 'Number should be longer than 7 characters'),
      email: isEmail('Invalid email'),
      password: isNotEmpty('password required'),
      termsOfService: (tos) => (isMember || !!tos ? null : 'Required for business')
    }
  });

  return (
    <>
      <h2>{isMember ? 'Login' : 'Register'}</h2>
      <form>
        {!isMember && (
          <>
            <TextInput
              withAsterisk
              required
              label="Name"
              type="name"
              key={form.key('name')}
              {...form.getInputProps('name')}
            />
            <TextInput
              withAsterisk
              required
              label="Mobile"
              type="phone"
              key={form.key('phone')}
              {...form.getInputProps('phone')}
            />
          </>
        )}

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

        <TextInput
          withAsterisk
          required
          type="password"
          label="Password"
          autoComplete="current-password"
          key={form.key('password')}
          {...form.getInputProps('password')}
        />

        {isMember && (
          <section className="forgot-password">
            <span className="forgot-password--text">Forgot Password?</span>
            <NavLink href={CRoutes.forgotPassword} rightSection="Reset" />
          </section>
        )}

        {!isMember && (
          <Checkbox
            mt="md"
            label="I agree to sell my privacy"
            key={form.key('termsOfService')}
            {...form.getInputProps('termsOfService', { type: 'checkbox' })}
          />
        )}

        <Group justify="flex-end" mt="md">
          <Button type="button" onClick={submitButton} fullWidth mt="md" radius="md" loading={isLoading}>
            Submit
          </Button>
        </Group>
        <section className="register-login">
          <span>{isMember ? 'Not a member yet?' : 'Already a member?'}</span>
          <UnstyledButton type="button" onClick={toggleMember} className="member-btn">
            {isMember ? 'Register' : 'Login'}
          </UnstyledButton>
        </section>
      </form>
    </>
  );
};

export default Login;
