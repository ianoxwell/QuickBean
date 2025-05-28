import { RootState } from '@app/store';
import { Card } from '@mantine/core';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import './register.scss';

const AccountWrapper = () => {
  const base = import.meta.env.VITE_BASE_URL;
  const { user } = useSelector((store: RootState) => store.user);
  const { checkout } = useSelector((store: RootState) => store.checkout);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setTimeout(() => {
        navigate(base);
      }, 500);
    }
  }, [base, user, navigate]);

  return (
    <main className="account-wrapper">
      <section className="login-section">
        <Card className="action-card" shadow="xs" withBorder radius="md" padding="lg">
          <h1>{checkout?.name || 'Quickbeans'}</h1>
          <Outlet />
        </Card>
      </section>
      <section className="splash-section"></section>
    </main>
  );
};

export default AccountWrapper;
