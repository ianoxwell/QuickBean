import { Badge, Button, Card, Flex, Stack, Text } from '@mantine/core';
import { IModifier } from '@models/modifier.dto';
import { fixWholeNumber } from '@utils/numberUtils';
import { Check, Edit, GripVertical } from 'lucide-react';

const ModifierItem = ({ modifier, isEditVisible }: { modifier: IModifier; isEditVisible: boolean }) => {
  const iconSize = 16;
  const smallIconSize = 14;

  if (!modifier) {
    return null;
  }

  return (
    <Card shadow="sm" mb="md" padding="sm" radius="md" withBorder className="modifier-item-card">
      <Flex gap="xs" align="center">
        {!isEditVisible && <GripVertical size={iconSize} className="modifier-drag-handle" />}
        <Stack gap={0} mb="xs" className="modifier-item" flex={1}>
          <Flex justify="space-between" align="center">
            <Flex gap="xs" align="center">
              <Text fw={700} size="md">
                {modifier.name}
              </Text>
              {modifier.isRequired && (
                <Badge color="red" variant="light" size="xs">
                  Required
                </Badge>
              )}
            </Flex>
            {isEditVisible && (
              <Button size="sm" variant="subtle" type="button" leftSection={<Edit size={iconSize} />}>
                Edit
              </Button>
            )}
          </Flex>
          <Flex gap="xs" wrap="wrap">
            {modifier.options.map((mOption) => (
              <Badge key={mOption.id} leftSection={mOption.isDefault ? <Check size={smallIconSize} /> : null}>
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
