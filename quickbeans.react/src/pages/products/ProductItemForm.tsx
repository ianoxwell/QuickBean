import { Flex, Image, InputLabel, NumberInput, Select, Stack, Text, Textarea, TextInput } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { EProductType } from '@models/base.dto';
import { IMessage } from '@models/message.dto';
import { IProduct } from '@models/products.dto';
import { convertProductType } from '@utils/stringUtils';
import { isMessage } from '@utils/typescriptHelpers';
import { DollarSign } from 'lucide-react';
import ProductItemModifierForm from './ProductItemModifierForm';

const ProductItemForm = ({
  form,
  product
}: {
  form: UseFormReturnType<IProduct>;
  product: IProduct | IMessage | undefined;
}) => {
  const iconSize = 16;
  const productTypeOptions = Object.values(EProductType) as EProductType[];

  if (!product || isMessage(product)) {
    return <Text size="sm">{isMessage(product) ? product.message : 'Product not found'}</Text>;
  }

  console.log('form and product', form.getValues(), product);

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
            leftSection={<DollarSign size={iconSize} />}
            {...form.getInputProps('baseCost')}
          />
        </Stack>
        <Stack gap="md" flex={1}>
          <Image src={product.imageUrl} alt={product.name} radius="md" mb="md" />

          {product.modifiers && product.modifiers.length > 0 && (
            <>
              <InputLabel>Modifiers:</InputLabel>
              <ProductItemModifierForm productModifiers={product.modifiers} />
            </>
          )}
        </Stack>
      </Flex>
    </form>
  );
};

export default ProductItemForm;
