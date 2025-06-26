import { CIconSizes } from '@app/appGlobal.const';
import { CRoutes } from '@app/routes.const';
import { useVenueNavigate } from '@app/useVenueNavigate';
import { ActionIcon, Badge, Button, Card, Flex, Stack, Text } from '@mantine/core';
import { IModifier } from '@models/modifier.dto';
import { fixWholeNumber } from '@utils/numberUtils';
import { Check, GripVertical, Trash, View } from 'lucide-react';

const ModifierItem = ({
  modifier,
  isEditVisible,
  removeModifier
}: {
  modifier: IModifier;
  isEditVisible: boolean;
  removeModifier?: () => void;
}) => {
  const navigate = useVenueNavigate();

  if (!modifier) {
    return null;
  }

  return (
    <Card shadow="sm" mb="md" padding="sm" radius="md" withBorder className="modifier-item-card">
      <Flex gap="xs" align="center">
        {!isEditVisible && <GripVertical size={CIconSizes.medium} className="modifier-drag-handle" />}
        <Stack gap={0} mb="xs" className="modifier-item" flex={1}>
          <Flex justify="space-between" align="center">
            <Flex gap="xs" align="center">
              <Text fw={700} size="md">
                {modifier.name}
              </Text>
              {modifier.isRequired && (
                <Badge color="orange" variant="light" size="xs">
                  Required
                </Badge>
              )}
            </Flex>
            {isEditVisible ? (
              <Button
                size="sm"
                variant="subtle"
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
                color="red"
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

export default ModifierItem;
