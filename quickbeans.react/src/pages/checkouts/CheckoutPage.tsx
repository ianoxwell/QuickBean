import { CRoutes } from '@app/routes.const';
import { RootState } from '@app/store';
import { useVenueNavigate } from '@app/useVenueNavigate';
import PageTitleForm from '@components/PageTitleForm/PageTitleForm.component';
import { matches } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { ICheckout } from '@models/checkout.dto';
import { isMessage } from '@utils/typescriptHelpers';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useGetCheckoutQuery, useUpdateCheckoutMutation } from './checkoutApiSlice';
import CheckoutForm from './CheckoutForm';
import { CheckoutFormProvider, useCheckoutForm } from './checkoutFormContext';
import CheckoutView from './CheckoutView';

const CheckoutPage = () => {
  const { slug: checkoutSlug } = useParams<{ slug: string }>();
  const venueState = useSelector((store: RootState) => store.venue);
  const navigate = useVenueNavigate();
  const {
    data: checkout,
    isLoading,
    isError
  } = useGetCheckoutQuery(
    {
      slug: checkoutSlug || '',
      venueSlug: venueState.slug || ''
    },
    {
      skip: !checkoutSlug || checkoutSlug === 'new' || !venueState.slug
    }
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editedCheckout, setEditedCheckout] = useState(checkout);
  const [updateCheckout] = useUpdateCheckoutMutation();

  const form = useCheckoutForm({
    mode: 'uncontrolled',
    initialValues: {
      ...(editedCheckout as ICheckout)
    },
    validate: {
      name: (value) => (value.length < 2 ? 'Name must be at least 2 characters long' : null),
      slug: (value) =>
        value.length < 2
          ? 'Slug must be at least 2 characters long'
          : value.toLowerCase() === 'new'
          ? 'Slug cannot be "new"'
          : null,
      description: (value) => (value.length < 5 ? 'Description must be at least 5 characters long' : null),
      heroImageTextColor: matches(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i, 'Invalid color format. Use #RRGGBB or #RGB')
    },
    enhanceGetInputProps() {
      if (!isEditing) {
        return { disabled: true };
      }
    }
  });

  if ((checkoutSlug === 'new' && !editedCheckout) || (!!checkout && !isMessage(checkout) && !checkout.id)) {
    console.log('Creating new checkout item');
    const newCheckout: ICheckout = {
      id: 0,
      name: '',
      slug: '',
      description: '',
      heroImageTextColor: '#FFFFFF',
      heroImage: '',
      checkoutUrl: `${venueState.slug || ''}/`,
      categories: []
    };

    setEditedCheckout(newCheckout);
    form.setValues(newCheckout);
    setIsEditing(true);
  }

  const handleEdit = () => {
    setIsEditing(true);
    setEditedCheckout(checkout);
    form.setValues(checkout as ICheckout);
    form.clearErrors();
  };

  const handleCancel = () => {
    if (editedCheckout && (editedCheckout as ICheckout).id === 0) {
      navigate(`/${CRoutes.checkouts}`);
      return;
    }

    setIsEditing(false);
    setEditedCheckout(checkout);
  };

  const handleSave = async () => {
    form.validate();
    if (!form.isValid()) {
      return;
    }

    try {
      const result = await updateCheckout(form.getValues()).unwrap();
      if (isMessage(result)) {
        console.error('Error saving checkout:', result.message);
        notifications.show({ message: `Error saving checkout: ${result.message}`, color: 'red' });
      } else {
        setIsEditing(false);
        notifications.show({ message: 'Checkout saved successfully!', color: 'green' });
      }
    } catch (error) {
      console.error('Failed to save checkout:', error);
      notifications.show({ message: 'Failed to save checkout.', color: 'red' });
    }
  };

  if (!checkoutSlug) {
    return null; // Handle the case where checkoutSlug is not provided
  }

  if (isLoading) {
    return <div>Loading checkout...</div>;
  }

  if (isError || isMessage(checkout)) {
    return <div>Error loading checkout</div>;
  }

  return (
    <>
      {!isLoading && !isError && (checkout || editedCheckout) && !isMessage(checkout) && (
        <div className="form">
          <PageTitleForm
            isEditing={isEditing}
            pageTitle="Checkout details"
            backRoute={CRoutes.checkouts}
            handleEdit={handleEdit}
            handleCancel={handleCancel}
            handleSave={handleSave}
          />
          {isEditing && editedCheckout && !isMessage(editedCheckout) ? (
            <CheckoutFormProvider form={form}>
              <CheckoutForm />
            </CheckoutFormProvider>
          ) : (
            <>{checkout && <CheckoutView checkout={checkout} />}</>
          )}
        </div>
      )}
    </>
  );
};

export default CheckoutPage;
