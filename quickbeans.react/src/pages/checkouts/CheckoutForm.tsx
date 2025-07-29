import { RootState } from '@app/store';
import { Box, Card, ColorInput, FileInput, Grid, Image, InputLabel, Stack, Text, TextInput } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { delay } from '@utils/numberUtils';
import { FocusIcon } from 'lucide-react';
import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import CheckoutAddCategory from './CheckoutAddCategory';
import CheckoutCategoryList from './CheckoutCategoryList';
import { useCheckoutFormContext } from './checkoutFormContext';

const CheckoutForm = () => {
  const form = useCheckoutFormContext();
  const formValue = form.getValues();
  const { slug: checkoutSlug } = useParams<{ slug: string }>();
  const venueState = useSelector((store: RootState) => store.venue);
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const isLargeScreen = useMediaQuery('(min-width: 1200px)'); // Mantine's lg breakpoint
  const [iframeError, setIframeError] = useState(false);
  const checkoutUrl = import.meta.env.VITE_CHECKOUT_URL || 'http://localhost:5173';

  const onFormChangeHandler = async () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      await delay(100); // Delay to ensure the iframe is ready to receive messages
      console.log('Posting message to iframe:', form.getValues().heroImageTextColor, form.values.heroImageTextColor);
      iframeRef.current.contentWindow.postMessage(
        { type: 'UPDATE_CHECKOUT_PREVIEW', payload: form.getValues() },
        checkoutUrl // Target origin of the checkout.react app
      );
    }
  };

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
    <form className="form product-form" onChange={onFormChangeHandler}>
      <Grid>
        <Grid.Col span={isLargeScreen ? 6 : 12}>
          <Stack gap="md">
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
              disallowInput={true}
              eyeDropperIcon={<FocusIcon size={18} aria-label="Pick a color" />}
              key={form.key('heroImageTextColor')}
              {...form.getInputProps('heroImageTextColor')}
              onChangeEnd={onFormChangeHandler}
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
        </Grid.Col>
        {isLargeScreen && (
          <Grid.Col span={6}>
            <Card
              shadow="sm"
              padding="md"
              radius="md"
              className="checkout-preview-card"
              withBorder
              style={{ position: 'sticky', top: '1rem' }}
            >
              {iframeError && (
                <Text color="red" size="sm" mb="md">
                  Error loading preview. Please ensure the checkout application is running.
                </Text>
              )}
              <iframe
                ref={iframeRef}
                src={`${checkoutUrl}/${formValue.checkoutUrl}/menu?previewMode=true`}
                style={{ width: '100%', height: '80vh', border: 'none' }}
                title="Checkout Preview"
                onError={() => setIframeError(true)}
                onLoad={() => setIframeError(false)}
              />
            </Card>
          </Grid.Col>
        )}
      </Grid>
    </form>
  );
};

export default CheckoutForm;
