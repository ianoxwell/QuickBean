import { useGetCheckoutQuery } from '@app/apiSlice';
import { CRoutes } from '@app/routes.const';
import { RootState } from '@app/store';
import { useVenueNavigate } from '@app/useVenueNavigate';
import PageTitleForm from '@components/PageTitleForm/PageTitleForm.component';
import Swatch from '@components/Swatch/Swatch.component';
import { Flex, Image, InputLabel, List, Stack, Text } from '@mantine/core';
import { matches } from '@mantine/form';
import { ICheckout } from '@models/checkout.dto';
import { isMessage } from '@utils/typescriptHelpers';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import CheckoutForm from './CheckoutForm';
import { CheckoutFormProvider, useCheckoutForm } from './checkoutFormContext';

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

  const handleSave = () => {
    form.validate();
    if (!form.isValid()) {
      return;
    }

    setIsEditing(false);
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
            <>
              {checkout && (
                <Flex gap="md" direction={{ base: 'column', sm: 'row' }}>
                  <Stack gap="md" flex={1}>
                    <div>
                      <InputLabel>Title:</InputLabel>
                      <Text>{checkout.name}</Text>
                    </div>
                    <div>
                      <InputLabel>Description:</InputLabel>
                      <Text>{checkout.description}</Text>
                    </div>
                    <div>
                      <Flex gap="xs" align="center">
                        <InputLabel>Slug:</InputLabel>
                        <Text c="dimmed" size="sm">
                          (Unique string used in the URL of checkout)
                        </Text>
                      </Flex>
                      <Text>{checkout.slug}</Text>
                    </div>
                    <div>
                      <InputLabel>Checkout URL:</InputLabel>
                      <Text>{checkout.checkoutUrl}</Text>
                    </div>
                    <div>
                      <InputLabel>Hero Image:</InputLabel>
                      <Image src={checkout.heroImage} alt={checkout.name} w="50%" h={200} radius="md" mb="md" />
                    </div>
                    <div>
                      <Flex gap="xs" align="center">
                        <InputLabel>Hero Image Text Color:</InputLabel>
                        <Text c="dimmed" size="sm">
                          (Used for text color to show on the hero image)
                        </Text>
                      </Flex>
                      <Flex gap="xs" align="center">
                        <Swatch backgroundColor={checkout.heroImageTextColor} />
                        <Text>{checkout.heroImageTextColor}</Text>
                      </Flex>
                    </div>
                    <div>
                      <InputLabel>Categories:</InputLabel>
                      {checkout.categories && checkout.categories.length > 0 ? (
                        [...checkout.categories]
                          .sort((a, b) => a.order - b.order)
                          .map((category) => (
                            <section key={category.id}>
                              <Text mb={4} fw={500}>
                                {category.name}
                              </Text>
                              {category.products && category.products.length > 0 ? (
                                <List mb="md">
                                  {category.products.map((product, index) => (
                                    <List.Item key={`${product.id}-${index}`}>{product.name}</List.Item>
                                  ))}
                                </List>
                              ) : (
                                <Text c="dimmed">No products current in this category</Text>
                              )}
                            </section>
                          ))
                      ) : (
                        <Text c="dimmed">No categories available</Text>
                      )}
                    </div>
                  </Stack>
                </Flex>
              )}
            </>
          )}

          {/* Add more details as needed */}
        </div>
      )}
    </>
  );
};

export default CheckoutPage;
