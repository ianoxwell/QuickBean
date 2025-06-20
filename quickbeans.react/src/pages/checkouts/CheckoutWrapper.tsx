import { Outlet } from 'react-router-dom';

const CheckoutWrapper = () => {
  return (
    <div>
      <h1>Checkouts</h1>
      <Outlet />
    </div>
  );
};

export default CheckoutWrapper;
