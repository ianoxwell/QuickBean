import { ActionIcon, Card, Flex, NumberInput, Switch, TextInput } from '@mantine/core';
import { IModifierOption } from '@models/modifier.dto';
import { Trash } from 'lucide-react';
import { useState } from 'react';
import { useModifierFormContext } from './modifierFormContext';

const ModifierItemOptionForm = ({ option, index }: { option: IModifierOption; index: number }) => {
  const form = useModifierFormContext();
  const formOptionValues = form.getValues().options || [];
  const [adjustmentType, setAdjustmentType] = useState<'percentAdjustment' | 'priceAdjustment'>(
    option.percentAdjustment ? 'percentAdjustment' : 'priceAdjustment'
  );

  const handleOptionDefaultChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    // Ensure only one option can be default
    const options = formOptionValues.map((option, i) => ({
      ...option,
      isDefault: i === index ? event.target.checked : false
    }));
    console.log('Updated options:', options);
    form.setFieldValue('options', options);
  };

  const handAdjustmentTypeChange = (type: 'percentAdjustment' | 'priceAdjustment') => {
    setAdjustmentType(type);
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Flex gap="md" direction="column">
        <Flex gap="md" justify="space-between" align="flex-end">
          <TextInput
            label="Option name"
            required
            flex={1}
            key={form.key(`options.${index}.label`)}
            {...form.getInputProps(`options.${index}.label`)}
          />
          {formOptionValues.length > 1 && (
            <ActionIcon size="input-sm" title="Remove option" color="red" onClick={() => form.removeListItem('options', index)}>
              <Trash size={16} />
            </ActionIcon>
          )}
        </Flex>
        <Switch
          label="Is default"
          description="This option will be selected by default"
          key={form.key(`options.${index}.isDefault`)}
          {...form.getInputProps(`options.${index}.isDefault`, { type: 'checkbox' })}
          onChange={(e) => handleOptionDefaultChange(e, index)}
        />

        <TextInput
          label="Description"
          key={form.key(`options.${index}.description`)}
          {...form.getInputProps(`options.${index}.description`)}
        />

        <Switch
          onLabel="$"
          offLabel="%"
          label={`Increase base cost by ${adjustmentType === 'priceAdjustment' ? '$' : '%'}`}
          checked={adjustmentType === 'priceAdjustment'}
          onChange={() =>
            handAdjustmentTypeChange(adjustmentType === 'priceAdjustment' ? 'percentAdjustment' : 'priceAdjustment')
          }
          key={form.key(`options.${index}.adjustmentType`)}
        />
        {adjustmentType === 'percentAdjustment' ? (
          <NumberInput
            label="Percent Amount"
            key={form.key(`options.${index}.percentAdjustment`)}
            {...form.getInputProps(`options.${index}.percentAdjustment`)}
            step={0.25}
            rightSection="%"
            rightSectionWidth={30}
          />
        ) : (
          <NumberInput
            label="Dollar Amount"
            step={0.25}
            key={form.key(`options.${index}.priceAdjustment`)}
            {...form.getInputProps(`options.${index}.priceAdjustment`)}
            leftSection="$"
            leftSectionWidth={30}
          />
        )}
      </Flex>
    </Card>
  );
};

export default ModifierItemOptionForm;
