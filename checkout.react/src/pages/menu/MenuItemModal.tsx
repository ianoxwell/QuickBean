import { CRoutes } from '@app/routes.const';
import { RootState } from '@app/store';
import { Modal } from '@mantine/core';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

const MenuItemModal = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { checkout } = useSelector((store: RootState) => store.checkout);
  let { product } = location.state;

  return (
    <Modal
      opened={!!product}
      onClose={() => {
        product = undefined;
        navigate(`/${checkout?.checkoutUrl}/${CRoutes.menu}`, { replace: true }); // Navigate back to the previous page
      }}
      title={product?.name || 'Item Details'}
    >
      <h1>Item modal</h1>
      <div>{product.name}</div>
    </Modal>
  );
};

export default MenuItemModal;
