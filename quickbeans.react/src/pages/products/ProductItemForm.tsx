import { Flex, Image, InputLabel, NumberInput, Select, Stack, Textarea, TextInput } from '@mantine/core';
import { EProductType } from '@models/base.dto';
import { convertProductType } from '@utils/stringUtils';
import { DollarSign } from 'lucide-react';
import ProductAddModifier from './ProductAddModifier';
import ProductItemModifierForm from './ProductItemModifierForm';
import { useProductFormContext } from './productFormContext';
import { CIconSizes } from '@app/appGlobal.const';

const ProductItemForm = () => {
  const form = useProductFormContext();
  const formValues = form.getValues();
  const productTypeOptions = Object.values(EProductType) as EProductType[];

  return (
    <form className="form product-form">
      <Flex gap="md" direction={{ base: 'column', sm: 'row' }}>
        <Stack gap="md" flex={1}>
          <TextInput label="Product Name" key={form.key('name')} withAsterisk {...form.getInputProps('name')} />
          <Select
            label="Product Type"
            key={form.key('productType')}
            {...form.getInputProps('productType')}
            data={productTypeOptions.map((type) => ({
              value: type,
              label: convertProductType(type)
            }))}
          />
          <Textarea label="Description" key={form.key('description')} {...form.getInputProps('description')} rows={4} />
          <NumberInput
            step={0.25}
            min={0}
            max={100}
            defaultValue={0}
            label="Base cost"
            key={form.key('baseCost')}
            leftSection={<DollarSign size={CIconSizes.medium} />}
            {...form.getInputProps('baseCost')}
          />
        </Stack>
        <Stack gap="md" flex={1}>
          {formValues.imageUrl && <Image src={formValues.imageUrl} alt={formValues.name} radius="md" mb="md" />}

          <InputLabel>Modifiers:</InputLabel>
          {formValues.modifiers && formValues.modifiers.length > 0 && <ProductItemModifierForm />}
          <ProductAddModifier />
        </Stack>
      </Flex>
    </form>
  );
};

export default ProductItemForm;
