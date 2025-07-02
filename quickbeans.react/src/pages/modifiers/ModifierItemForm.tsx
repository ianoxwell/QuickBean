import { CRoutes } from '@app/routes.const';
import VenueNavLink from '@components/VenueNavLink/VenueNavLink.component';
import { Button, Checkbox, Flex, InputLabel, Stack, Text, TextInput } from '@mantine/core';
import { Plus } from 'lucide-react';
import { useModifierFormContext } from './modifierFormContext';
import ModifierItemOptionForm from './ModifierItemOptionForm';

const ModifierItemForm = () => {
  const form = useModifierFormContext();
  const formValues = form.getValues();

  const blankOption = {
    label: '',
    description: '',
    isDefault: false,
    percentAdjustment: 0,
    priceAdjustment: 0
  };

  if (!formValues) {
    return <Text>Loading...</Text>;
  }

  return (
    <form className="form modifier-form">
      <Flex gap="xl" direction={{ base: 'column', sm: 'row' }}>
        <Stack gap="md" flex={1}>
          <TextInput label="Modifier Name" key={form.key('name')} withAsterisk {...form.getInputProps('name')} />
          <Checkbox
            label="Is required"
            description="Patron will have to select an option to add product to cart"
            key={form.key('isRequired')}
            {...form.getInputProps('isRequired', { type: 'checkbox' })}
          />
          {formValues.products?.length && (
            <>
              <InputLabel>Products this modifier is applied to</InputLabel>
              {formValues.products.map((product) => (
                <VenueNavLink path={`${CRoutes.products}/${product.id}`} label={product.name} key={product.id} />
              ))}
            </>
          )}
        </Stack>
        <Stack gap="md" flex={1}>
          {formValues.options && formValues.options.length > 0 && (
            <>
              <InputLabel>Options:</InputLabel>
              {formValues.options.map((option, index) => (
                <div key={option.id || index}>
                  <ModifierItemOptionForm option={option} index={index} />
                </div>
              ))}
            </>
          )}
          {form.errors?.options && (
            <Text c="red.8" size="sm" ta="right">
              {form.errors.options}
            </Text>
          )}
          <Flex justify="flex-end" mt="md">
            <Button
              title="Add option"
              leftSection={<Plus size={16} />}
              onClick={() => {
                form.insertListItem('options', blankOption);
                form.clearFieldError('options');
              }}
            >
              Add option
            </Button>
          </Flex>
        </Stack>
      </Flex>
    </form>
  );
};

export default ModifierItemForm;
