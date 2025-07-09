
import { useAppSelector } from '../../app/hooks';
import { IVenue } from '@models/venue.dto';
import { useUpdateVenueMutation, useUploadVenueImageMutation } from '../../app/venueApiSlice';
import { VenueFormProvider, useVenueForm } from './venueFormContext';
import SettingsForm from './SettingsForm';
import PageTitleForm from '../../components/PageTitleForm/PageTitleForm.component';
import { useState } from 'react';
import { CRoutes } from '../../app/routes.const';
import { hasLength } from '@mantine/form';
import SettingsView from './SettingsView';

const SettingsPage = () => {
  const venue = useAppSelector((state) => state.venue.venue);
  const [updateVenue] = useUpdateVenueMutation();
  const [uploadVenueImage] = useUploadVenueImageMutation();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);

  const form = useVenueForm({
    mode: 'uncontrolled',
    initialValues: venue,
    validate: {
      name: hasLength({ min: 2, max: 30 }, 'Name must be between 2 and 30 characters long'),
      legalBusinessName: hasLength({ min: 2, max: 100 }, 'Legal business name must be between 2 and 100 characters long'),
    },
  });

  const handleEdit = () => {
    setIsEditing(true);
    form.setValues(venue as IVenue);
    form.clearErrors();
    setSelectedImageFile(null); // Clear any previously selected file when entering edit mode
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedImageFile(null); // Clear selected file on cancel
  };

  const handleSave = async () => {
    form.validate();
    if (!form.isValid()) {
      return;
    }

    let logoImageUrl = form.values.logoImage; // Start with the current URL from the form

    if (selectedImageFile) {
      if (!venue) return; // Should not happen if venue is loaded
      try {
        const { url } = await uploadVenueImage({ venueId: venue.id, file: selectedImageFile }).unwrap();
        logoImageUrl = url; // Update with the new URL from the upload
      } catch (error) {
        console.error('Failed to upload image', error);
        return; // Stop save if image upload fails
      }
    }

    try {
      // Create a new object with the potentially updated logoImage URL
      const valuesToSave = { ...form.values, logoImage: logoImageUrl };
      await updateVenue(valuesToSave).unwrap();
      setIsEditing(false);
      setSelectedImageFile(null); // Clear selected file after successful save
      // Optionally, show a success notification
    } catch (error) {
      // Optionally, show an error notification
      console.error(error);
    }
  };

  if (!venue) {
    return <div>Loading venue settings...</div>;
  }

  return (
    <div className="form">
      <PageTitleForm
        isEditing={isEditing}
        pageTitle="Venue Settings"
        backRoute={CRoutes.dashboard}
        handleEdit={handleEdit}
        handleCancel={handleCancel}
        handleSave={handleSave}
        isFormValid={form.isValid()}
      />
      {isEditing ? (
        <VenueFormProvider form={form}>
          <form onSubmit={form.onSubmit(handleSave)}>
            <SettingsForm
              selectedImageFile={selectedImageFile}
              setSelectedImageFile={setSelectedImageFile}
            />
          </form>
        </VenueFormProvider>
      ) : (
        <SettingsView venue={venue} />
      )}
    </div>
  );
};

export default SettingsPage;
