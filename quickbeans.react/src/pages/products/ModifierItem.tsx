import { Button, Flex, Stack, Badge, Text } from '@mantine/core';
import { IModifier } from '@models/modifier.dto';
import { Edit } from 'lucide-react';

const ModifierItem = ({ modifier }: { modifier: IModifier }) => {
  const iconSize = 16;

  if (!modifier) {
    return null;
  }

  return (
    <Stack gap={0} mb="xs" className="modifier-item">
      <Flex justify="space-between" align="center">
        <Text fw={700} size="md">{modifier.name}</Text>
        <Button size="sm" variant="subtle" type="button" leftSection={<Edit size={iconSize} />}>
          Edit
        </Button>
      </Flex>
      <Flex gap="xs" wrap="wrap">
        {modifier.options.map((mOption) => (
          <Badge key={mOption.id}>
            {mOption.label} (+${mOption.priceAdjustment?.toFixed(2)})
          </Badge>
        ))}
      </Flex>
    </Stack>
  );
};

export default ModifierItem;
