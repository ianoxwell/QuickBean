import { CRoutes } from '@app/routes.const';
import { RootState } from '@app/store';
import { ActionIcon, Chip, Group, Image, Modal, useMatches } from '@mantine/core';
import { IOrderItem } from '@models/order.dto';
import { IProduct } from '@models/products.dto';
import { calcOrderItemPrice } from '@utils/costCalculator';
import { fixWholeNumber } from '@utils/numberUtils';
import { ChevronLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

const MenuItemModal = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // const iconSize = 16;
  const iconPlusSize = 28;
  const { checkout } = useSelector((store: RootState) => store.checkout);
  let { product, orderItem }: { product: IProduct | undefined; orderItem: IOrderItem | undefined } = location.state;
  const [selectedModifiers, setSelectedModifiers] = useState<string[]>([]);
  const modalProps = useMatches({
    base: { fullScreen: true, radius: 0 },
    md: { size: '60rem', radius: 'md' }
  });
  const [order, setOrder] = useState<IOrderItem>({
    id: orderItem?.id || 0,
    productId: product?.id || 0,
    quantity: orderItem?.quantity || 1,
    price: product?.baseCost || 0,
    selectedModifiers: orderItem?.selectedModifiers || []
  });
  const [totalPrice, setTotalPrice] = useState<string>(fixWholeNumber(order.price, 2));

  useEffect(() => {
    if (product && orderItem) {
      // Initialize selectedModifiers from the orderItem if available
      const initialModifiers = orderItem.selectedModifiers?.map((m) => `${m.optionId}`) || [];
      setSelectedModifiers(initialModifiers);
    }
  }, [product, orderItem]);

  const closeModal = () => {
    product = undefined; // Clear the product state
    orderItem = undefined; // Clear the orderItem state
    navigate(`/${checkout?.checkoutUrl}/${CRoutes.menu}`, { replace: true }); // Navigate back to the previous page
  };

  /** When any modifiers for the order item are changed */
  const modifierChange = (optionId: number, modifierId: number) => {
    if (!order.selectedModifiers) {
      order.selectedModifiers = [];
    }

    const existingModifier = order.selectedModifiers.find((m) => m.modifierId === modifierId);
    if (existingModifier) {
      if (existingModifier.optionId === optionId) {
        return;
      }

      order.selectedModifiers = order.selectedModifiers.filter((m) => m.modifierId !== modifierId);
    }

    const modifier = product?.modifiers.find((m) => m.id === modifierId);
    if (!modifier) {
      console.error(`Modifier with id ${modifierId} not found in product modifiers.`);
      return;
    }

    const option = modifier.options.find((o) => o.id === optionId);
    if (!option) {
      console.error(`Option with id ${optionId} not found in modifier ${modifier.name}.`);
      return;
    }

    order.selectedModifiers.push({
      modifierId,
      optionId: option.id,
      label: option.label,
      priceAdjustment: option.priceAdjustment ? Number(option.priceAdjustment) : 0,
      percentAdjustment: option.percentAdjustment
    });
    setSelectedModifiers(order.selectedModifiers.map((m) => `${m.modifierId}-${m.optionId}`));
    order.price = calcOrderItemPrice(order, product);
    setOrder(order);

    setTotalPrice(fixWholeNumber(order.price, 2));
  };

  if (!product) {
    return null; // If no product is provided, do not render the modal
  }

  return (
    <Modal
      opened={!!product}
      onClose={closeModal}
      withCloseButton={false}
      aria-label={product?.name || 'Item Details'}
      padding={0}
      {...modalProps}
    >
      <div className="modal-wrapper">
        <Image src={product?.imageUrl} height={420} alt={product.name} />
        <div className="flex-float-header">
          <ActionIcon
            type="button"
            size="xl"
            aria-label="back"
            onClick={closeModal}
            variant="white"
            color="dark.6"
            radius="xl"
          >
            <ChevronLeft size={iconPlusSize} />
          </ActionIcon>
        </div>
        <div className="modal-wrapper--title">
          <h1 className="modal-wrapper--title__text">{product.name}</h1>
        </div>
        <div className="modal-wrapper--contents">
          <p>{product.description}</p>
          {!!product.modifiers.length && (
            <>
              {product.modifiers.map((modifier) => {
                return (
                  <div className="modal-wrapper--contents__modifier" key={modifier.id}>
                    <h2>{modifier.name}</h2>
                    <Chip.Group value={selectedModifiers.filter((m) => parseInt(m.split('-')[0]) === modifier.id)}>
                      <Group>
                        {modifier.options.map((option) => {
                          return (
                            <Chip
                              className="modal-wrapper--contents__modifier__option"
                              key={`${modifier.id}-${option.id}`}
                              value={`${modifier.id}-${option.id}`}
                              onChange={() => {
                                modifierChange(option.id, modifier.id);
                              }}
                              radius="md"
                            >
                              <span>{option.label}</span>
                              {(option.priceAdjustment ?? 0) > 0 && (
                                <span className="modal-wrapper--contents__modifier__option__price">
                                  +${fixWholeNumber(option.priceAdjustment ?? 0, 2)}
                                </span>
                              )}
                            </Chip>
                          );
                        })}
                      </Group>
                    </Chip.Group>
                  </div>
                );
              })}
            </>
          )}
          <div>Price - ${totalPrice}</div>
        </div>
      </div>
    </Modal>
  );
};

export default MenuItemModal;
