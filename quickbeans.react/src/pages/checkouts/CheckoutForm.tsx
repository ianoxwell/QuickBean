import { RootState } from '@app/store';
import { Flex, InputLabel, Stack, Text, TextInput } from '@mantine/core';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useCheckoutFormContext } from './checkoutFormContext';

const CheckoutForm = () => {
  const form = useCheckoutFormContext();
  const formValue = form.getValues();
  const { slug: checkoutSlug } = useParams<{ slug: string }>();
  const venueState = useSelector((store: RootState) => store.venue);

  const updateCheckoutUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = `${venueState.slug}/${e.target.value}`;
    form.setFieldValue('checkoutUrl', newUrl);
  };

  return (
    <form className="form product-form">
      <Flex gap="md" direction={{ base: 'column', sm: 'row' }}>
        <Stack gap="md" flex={1}>
          <TextInput label="Checkout name" key={form.key('name')} withAsterisk {...form.getInputProps('name')} />
          <TextInput
            label="Checkout description"
            key={form.key('description')}
            {...form.getInputProps('description')}
          />
          <TextInput
            label="Checkout slug"
            key={form.key('slug')}
            withAsterisk
            {...form.getInputProps('slug')}
            disabled={checkoutSlug !== 'new'}
            onChange={updateCheckoutUrl}
            description="Unique string used in the URL of checkout, cannot be changed after creation."
          />
          <div>
            <InputLabel>Checkout URL:</InputLabel>
            <Text>{formValue.checkoutUrl}</Text>
          </div>
        </Stack>
      </Flex>
    </form>
  );
};

export default CheckoutForm;
