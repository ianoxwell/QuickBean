import { ActionIcon, Flex, NumberInput, NumberInputHandlers, Tooltip } from '@mantine/core';
import { Minus, Plus } from 'lucide-react';
import { useRef } from 'react';
import './QuantityInput.component.scss';

const QuantityInput = ({ quantity, onChange }: { quantity: number; onChange: (value: number | string) => void }) => {
  const handlersRef = useRef<NumberInputHandlers>(null);
  const iconSize = 16;

  return (
    <Flex gap="xs" className="quantity-input" align="center">
      <ActionIcon
        size="input-sm"
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
          hideControls
        />
      </Tooltip>
      <ActionIcon
        size="input-sm"
        onClick={() => handlersRef.current?.increment()}
        type="button"
        radius="xl"
        aria-label="Increment"
      >
        <Plus size={iconSize} />
      </ActionIcon>
    </Flex>
  );
};

export default QuantityInput;
