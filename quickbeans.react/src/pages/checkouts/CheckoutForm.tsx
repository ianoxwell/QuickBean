import { RootState } from '@app/store';
import { Box, ColorInput, FileInput, Flex, Image, InputLabel, Stack, Text, TextInput } from '@mantine/core';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import CheckoutAddCategory from './CheckoutAddCategory';
import CheckoutCategoryList from './CheckoutCategoryList';
import { useCheckoutFormContext } from './checkoutFormContext';
import { FocusIcon } from 'lucide-react';

const CheckoutForm = () => {
  const form = useCheckoutFormContext();
  const formValue = form.getValues();
  const { slug: checkoutSlug } = useParams<{ slug: string }>();
  const venueState = useSelector((store: RootState) => store.venue);
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);

  const handleFileChange = (file: File | null) => {
    setHeroImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setFieldValue('heroImage', reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      form.setFieldValue('heroImage', '');
    }
  };

  const updateCheckoutUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = `${venueState.slug}/${e.target.value}`;
    form.setFieldValue('checkoutUrl', newUrl);
  };

  if (!form || !Object.keys(formValue).length) {
    return <Text>Loading...</Text>;
  }

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
            readOnly={checkoutSlug !== 'new'}
            onChange={updateCheckoutUrl}
            description="Unique string used in the URL of checkout, cannot be changed after creation."
          />
          <div>
            <InputLabel>Checkout URL:</InputLabel>
            <Text>{form.values.checkoutUrl}</Text>
          </div>
          <ColorInput
            label="Hero Image Text Color"
            placeholder="Pick a color"
            eyeDropperIcon={<FocusIcon size={18} aria-label="Pick a color" />}
            {...form.getInputProps('heroImageTextColor')}
          />
          <Stack gap="md">
            <InputLabel>Hero Image</InputLabel>
            {(form.values.heroImage || formValue.heroImage) && (
              <Box>
                <Image
                  src={form.values.heroImage || formValue.heroImage}
                  alt="Hero image preview"
                  w="50%"
                  h={150}
                  radius="md"
                  mb="md"
                />
              </Box>
            )}
            <FileInput
              placeholder="Upload a hero image"
              value={heroImageFile}
              onChange={handleFileChange}
              error={form.errors.heroImage}
              accept="image/png,image/jpeg"
              // Client-side validation for file size
              onBlur={() => {
                if (heroImageFile && heroImageFile.size > 1 * 1024 * 1024) {
                  form.setFieldError('heroImage', 'File size must be less than 1MB');
                } else {
                  form.clearFieldError('heroImage');
                }
              }}
            />
          </Stack>

          <InputLabel>Categories</InputLabel>
          <CheckoutCategoryList />
          <CheckoutAddCategory />
        </Stack>
      </Flex>
    </form>
  );
};

export default CheckoutForm;
