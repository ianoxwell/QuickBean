import { ActionIcon, NumberInput, NumberInputHandlers, Tooltip } from '@mantine/core';
import { Minus, Plus } from 'lucide-react';
import { useRef } from 'react';
import './QuantityInput.component.scss';

const QuantityInput = ({
  quantity,
  size,
  onChange
}: {
  quantity: number;
  size: 'sm' | 'lg';
  onChange: (value: number | string) => void;
}) => {
  const handlersRef = useRef<NumberInputHandlers>(null);
  const iconSize = 16;

  return (
    <div className={`quantity-input size--${size}`}>
      <ActionIcon
        size={size === 'sm' ? 'input-xs' : 'input-sm'}
        onClick={() => handlersRef.current?.decrement()}
        type="button"
        radius="xl"
        aria-label="Decrement"
      >
        <Minus size={iconSize} />
      </ActionIcon>
      <Tooltip label="Enter quantity" position="top" withArrow>
        <NumberInput
          placeholder="Quantity"
          handlersRef={handlersRef}
          className="quantity-input__input"
          step={1}
          min={0}
          max={99}
          value={quantity}
          onChange={onChange}
          size={size === 'sm' ? 'xs' : 'md'}
          hideControls
        />
      </Tooltip>
      <ActionIcon
        size={size === 'sm' ? 'input-xs' : 'input-sm'}
        onClick={() => handlersRef.current?.increment()}
        type="button"
        radius="xl"
        aria-label="Increment"
      >
        <Plus size={iconSize} />
      </ActionIcon>
    </div>
  );
};

export default QuantityInput;
