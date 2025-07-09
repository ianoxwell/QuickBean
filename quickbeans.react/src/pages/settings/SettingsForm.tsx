import { SimpleGrid, TextInput, FileInput, Image, Text } from '@mantine/core';
import { useVenueFormContext } from './venueFormContext';
import { useEffect, useState } from 'react';

interface SettingsFormProps {
  selectedImageFile: File | null;
  setSelectedImageFile: (file: File | null) => void;
}

const SettingsForm = ({ selectedImageFile, setSelectedImageFile }: SettingsFormProps) => {
  const form = useVenueFormContext();
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | undefined>(form.values.logoImage);
  const [imageSizeKb, setImageSizeKb] = useState<number | null>(null);

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  useEffect(() => {
    if (selectedImageFile) {
      const previewUrl = URL.createObjectURL(selectedImageFile);
      setImagePreviewUrl(previewUrl);
      setImageSizeKb(selectedImageFile.size / 1024);
    } else {
      setImagePreviewUrl(form.values.logoImage);
      // If no new file is selected, and there's an existing image URL, we can't get its size directly.
      setImageSizeKb(null);
    }
  }, [selectedImageFile, form.values.logoImage]);

  const onFileChange = (file: File | null) => {
    setSelectedImageFile(file);
  };

  return (
    <SimpleGrid cols={{ base: 1, sm: 2 }} mt="xl">
      <div>
        {imagePreviewUrl && <Image src={imagePreviewUrl} alt={form.values.name} radius="md" mb="md" w={200} />}
        {imageSizeKb && <Text size="sm" c="dimmed">Estimated size: {imageSizeKb.toFixed(2)} KB</Text>}
        <FileInput
          label="Logo"
          placeholder="Upload new logo"
          onChange={onFileChange}
          value={selectedImageFile}
          error={form.errors.logoImage}
          accept="image/*"
          // Client-side validation for file size
          onBlur={() => {
            if (selectedImageFile && selectedImageFile.size > 1 * 1024 * 1024) {
              form.setFieldError('logoImage', 'File size must be less than 1MB');
            } else {
              form.clearFieldError('logoImage');
            }
          }}
        />
      </div>
      <TextInput label="Public Phone" placeholder="(123) 456-7890" {...form.getInputProps('publicPhone')} />
      <TextInput label="Name" placeholder="Venue name" {...form.getInputProps('name')} />
      <TextInput label="Website URL" placeholder="https://example.com" {...form.getInputProps('websiteUrl')} />
      <TextInput label="Address" placeholder="123 Main St" {...form.getInputProps('address')} />
      <TextInput label="City" placeholder="Anytown" {...form.getInputProps('city')} />
      <TextInput label="State" placeholder="CA" {...form.getInputProps('state')} />
      <TextInput label="Postcode" placeholder="12345" {...form.getInputProps('postcode')} />
      <TextInput label="Legal Business Name" placeholder="Your Business Inc." {...form.getInputProps('legalBusinessName')} />
      <TextInput label="Legal Business Number" placeholder="Your ABN/ACN" {...form.getInputProps('legalBusinessNumber')} />
      <TextInput label="Timezone" placeholder="Australia/Sydney" {...form.getInputProps('timezone')} />
      <TextInput label="Privacy Policy" placeholder="Your privacy policy URL" {...form.getInputProps('privacyPolicy')} />
    </SimpleGrid>
  );
};

export default SettingsForm;
