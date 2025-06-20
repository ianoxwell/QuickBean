import { Outlet } from 'react-router-dom';

const ProductsWrapper = () => {
  return (
    <div>
      <h1>Products</h1>
      <Outlet />
    </div>
  );
};

export default ProductsWrapper;
