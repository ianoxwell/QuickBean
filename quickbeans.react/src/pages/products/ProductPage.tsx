import { useGetProductQuery } from '@app/apiSlice';
import { CRoutes } from '@app/routes.const';
import { RootState } from '@app/store';
import { useVenueNavigate } from '@app/useVenueNavigate';
import PageTitleForm from '@components/PageTitleForm/PageTitleForm.component';
import { Flex, Image, InputLabel, Stack, Text } from '@mantine/core';
import { hasLength, isNotEmpty } from '@mantine/form';
import { EProductType } from '@models/base.dto';
import { IProduct } from '@models/products.dto';
import { convertProductType } from '@utils/stringUtils';
import { isMessage } from '@utils/typescriptHelpers';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import ProductItemForm from './ProductItemForm';
import ProductModifierItem from './ProductModifierItem';
import { ProductFormProvider, useProductForm } from './productFormContext';

const ProductPage = () => {
  const { id: productId } = useParams<{ id: string }>();
  const venueState = useSelector((store: RootState) => store.venue);
  const navigate = useVenueNavigate();
  const {
    data: product,
    isLoading,
    isError
  } = useGetProductQuery(
    { productId: productId!, venueId: venueState.id! },
    {
      skip: !productId || !venueState.id || parseInt(productId, 10) === 0
    }
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState(product);

  const form = useProductForm({
    mode: 'uncontrolled',
    initialValues: {
      ...(editedProduct as IProduct)
    },
    validate: {
      name: hasLength({ min: 2, max: 30 }, 'Product name must be between 2 and 30 characters long'),
      description: hasLength({ min: 2, max: 100 }, 'Description must be between 2 and 100 characters long'),
      imageUrl: isNotEmpty('Image URL is required')
    },
    enhanceGetInputProps() {
      if (!isEditing) {
        return { disabled: true };
      }
    }
  });

  if (
    productId &&
    parseInt(productId, 10) === 0 &&
    (!editedProduct || (!isMessage(editedProduct) && editedProduct.id !== 0))
  ) {
    const newItem = {
      id: 0,
      name: '',
      productType: EProductType.HOT_DRINK,
      description: '',
      imageUrl: '',
      baseCost: 0,
      modifiers: []
    };
    setEditedProduct(newItem);
    form.setValues(newItem);
    setIsEditing(true);
  }

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProduct(product);
    form.setValues(product as IProduct);
    form.clearErrors();
  };

  const handleCancel = () => {
    if (editedProduct && (editedProduct as IProduct).id === 0) {
      navigate(`/${CRoutes.products}`);
      return;
    }

    setIsEditing(false);
    setEditedProduct(product);
  };

  const handleSave = () => {
    form.validate();
    if (!form.isValid()) {
      console.error('Form validation failed', form.errors);
      return;
    }

    setIsEditing(false);
  };

  if (!productId) {
    return null; // Handle the case where productId is not provided
  }

  if (isLoading) {
    return <div>Loading product...</div>;
  }

  if (isError || isMessage(product)) {
    return <div>Error loading product</div>;
  }

  return (
    <>
      {!isLoading && !isError && (product || editedProduct) && !isMessage(product) && (
        <div className="form">
          <PageTitleForm
            isEditing={isEditing}
            pageTitle="Product details"
            backRoute={CRoutes.products}
            handleEdit={handleEdit}
            handleCancel={handleCancel}
            handleSave={handleSave}
          />

          {isEditing && editedProduct && !isMessage(editedProduct) ? (
            <ProductFormProvider form={form}>
              <ProductItemForm />
            </ProductFormProvider>
          ) : (
            <>
              {product && (
                <Flex gap="md" direction={{ base: 'column', sm: 'row' }}>
                  <Stack gap="md" flex={1}>
                    <div>
                      <InputLabel>Product Name</InputLabel>
                      <Text>{product.name}</Text>
                    </div>
                    <div>
                      <InputLabel>Product Type</InputLabel>
                      <Text>{convertProductType(product.productType)}</Text>
                    </div>

                    <div>
                      <InputLabel>Description</InputLabel>
                      <Text>{product.description}</Text>
                    </div>
                    <div>
                      <InputLabel>Base cost</InputLabel>
                      <Text>${product.baseCost}</Text>
                    </div>
                  </Stack>
                  <Stack gap="md" flex={1}>
                    <Image src={product.imageUrl} alt={product.name} radius="md" mb="md" />

                    {product.modifiers && product.modifiers.length > 0 && (
                      <>
                        <InputLabel>Modifiers:</InputLabel>
                        {product.modifiers.map((modifier) => (
                          <ProductModifierItem key={modifier.id} modifier={modifier} isViewVisible={!isEditing} />
                        ))}
                      </>
                    )}
                  </Stack>
                </Flex>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ProductPage;
