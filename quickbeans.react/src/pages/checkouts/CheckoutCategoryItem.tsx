import { CIconSizes } from '@app/appGlobal.const';
import { ActionIcon, Card, Flex, InputLabel, Stack, Text, TextInput } from '@mantine/core';
import { GripVertical, Trash } from 'lucide-react';
import { useCheckoutFormContext } from './checkoutFormContext';
import { convertProductType } from '@utils/stringUtils';
import { DraggableProvidedDragHandleProps } from '@hello-pangea/dnd';
import { ICheckoutCategory } from '@models/checkout-category.dto';

interface CheckoutCategoryItemProps {
  index: number;
  onRemove: (index: number) => void;
  dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
  category: ICheckoutCategory | undefined;
}

const CheckoutCategoryItem = ({ index, onRemove, dragHandleProps, category }: CheckoutCategoryItemProps) => {
  const form = useCheckoutFormContext();
  // const category = form.values.categories?.[index];

  if (!category) {
    return <div {...dragHandleProps}></div>;
  }

  return (
    <Card shadow="sm" mb="md" padding="sm" radius="md" withBorder className="modifier-item-card">
      <Flex gap="xs" align="center">
        <div {...dragHandleProps} aria-label="Drag to reorder category">
          <GripVertical size={CIconSizes.medium} className="modifier-drag-handle" />
        </div>
        <Flex justify="space-between" align="center" className="modifier-item" flex={1}>
          <Flex gap="md" direction={{ base: 'column', sm: 'row' }}>
            <Stack gap={0} mb="xs">
              <InputLabel>Category Name</InputLabel>
              <TextInput placeholder="Category name" {...form.getInputProps(`categories.${index}.name`)} />
            </Stack>
            <Stack gap={0} mb="xs">
              <InputLabel>Product Type</InputLabel>
              <Text>{convertProductType(category.productType)}</Text>
            </Stack>
          </Flex>
          <ActionIcon
            color="red.9"
            type="button"
            radius="xl"
            variant="outline"
            title="Remove this category from this product"
            onClick={() => onRemove(index)}
          >
            <Trash size={CIconSizes.medium} />
          </ActionIcon>
        </Flex>
      </Flex>
    </Card>
  );
};

export default CheckoutCategoryItem;
