import { CIconSizes } from '@app/appGlobal.const';
import { CRoutes } from '@app/routes.const';
import { useVenueNavigate } from '@app/useVenueNavigate';
import { DraggableProvidedDragHandleProps } from '@hello-pangea/dnd';
import { ActionIcon, Badge, Button, Card, Flex, Stack, Text } from '@mantine/core';
import { IModifier } from '@models/modifier.dto';
import { fixWholeNumber } from '@utils/numberUtils';
import { Check, GripVertical, Trash, View } from 'lucide-react';

const ProductModifierItem = ({
  modifier,
  isViewVisible,
  removeModifier,
  dragHandleProps
}: {
  modifier: IModifier;
  isViewVisible: boolean;
  removeModifier?: () => void;
  dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
}) => {
  const navigate = useVenueNavigate();

  if (!modifier) {
    return <div {...dragHandleProps}></div>;
  }

  return (
    <Card shadow="sm" mb="md" padding="sm" radius="md" withBorder className="modifier-item-card">
      <Flex gap="xs" align="center">
        {!isViewVisible && (
          <div {...dragHandleProps} aria-label="Drag to reorder modifier">
            <GripVertical size={CIconSizes.medium} className="modifier-drag-handle" />
          </div>
        )}
        <Stack gap={0} mb="xs" className="modifier-item" flex={1}>
          <Flex justify="space-between" align="center">
            <Flex gap="xs" align="center">
              <Text fw={700} size="md">
                {modifier.name}
              </Text>
              {modifier.isRequired && (
                <Badge color="grape.8" size="sm">
                  Required
                </Badge>
              )}
            </Flex>
            {isViewVisible ? (
              <Button
                size="sm"
                variant="subtle"
                color="accent"
                type="button"
                onClick={() => {
                  navigate(`${CRoutes.modifiers}/${modifier.id}`);
                }}
                leftSection={<View size={CIconSizes.medium} />}
              >
                View
              </Button>
            ) : (
              <ActionIcon
                variant="outline"
                title="Remove this modifier from this product"
                radius="xl"
                type="button"
                color="red.9"
                onClick={removeModifier}
              >
                <Trash size={CIconSizes.medium} />
              </ActionIcon>
            )}
          </Flex>
          <Flex gap="xs" wrap="wrap">
            {modifier.options.map((mOption) => (
              <Badge key={mOption.id} leftSection={mOption.isDefault ? <Check size={CIconSizes.small} /> : null}>
                {mOption.label} (+${fixWholeNumber(mOption.priceAdjustment, 2)})
              </Badge>
            ))}
          </Flex>
        </Stack>
      </Flex>
    </Card>
  );
};

export default ProductModifierItem;
