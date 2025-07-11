import { CIconSizes } from '@app/appGlobal.const';
import { RootState } from '@app/store';
import { DraggableProvidedDragHandleProps } from '@hello-pangea/dnd';
import { ActionIcon, Card, Flex, InputLabel, Popover, ScrollArea, Stack, Text, TextInput } from '@mantine/core';
import { ICheckoutCategory } from '@models/checkout-category.dto';
import { IProduct } from '@models/products.dto';
import { convertProductType } from '@utils/stringUtils';
import { GripVertical, Trash } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useCheckoutFormContext } from './checkoutFormContext';

import { useDisclosure } from '@mantine/hooks';

interface CheckoutCategoryItemProps {
  index: number;
  onRemove: (index: number) => void;
  dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
  category: ICheckoutCategory | undefined;
}

const CheckoutCategoryItem = ({
  index,
  onRemove,
  dragHandleProps,
  category,
}: CheckoutCategoryItemProps) => {
  const form = useCheckoutFormContext();
  const venueState = useSelector((store: RootState) => store.venue);
  const productsInVenue: IProduct[] = venueState.venue?.products || [];
  const [opened, { close, open }] = useDisclosure(false);

  if (!category) {
    return <div {...dragHandleProps}></div>;
  }

  const filteredProducts = productsInVenue.filter((product) => product.productType === category.productType);

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
            <Stack gap={0} mb="xs">
              <InputLabel>Products</InputLabel>
              <Popover width={200} withArrow shadow="md" opened={opened}>
                <Popover.Target>
                  <Text
                    c="blue"
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={open}
                    onMouseLeave={close}
                  >
                    {filteredProducts.length} products
                  </Text>
                </Popover.Target>
                <Popover.Dropdown>
                  <ScrollArea>
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((product) => (
                        <Text key={product.id} size="sm">
                          {product.name}
                        </Text>
                      ))
                    ) : (
                      <Text size="sm" c="dimmed">
                        No products in this category.
                      </Text>
                    )}
                  </ScrollArea>
                </Popover.Dropdown>
              </Popover>
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
