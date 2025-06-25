import { useGetProductQuery } from '@app/apiSlice';
import { CRoutes } from '@app/routes.const';
import { RootState } from '@app/store';
import PageTitleForm from '@components/PageTitleForm/PageTitleForm.component';
import { Flex, Image, InputLabel, Stack, Text } from '@mantine/core';
import { hasLength, isNotEmpty, useForm } from '@mantine/form';
import { EProductType } from '@models/base.dto';
import { IProduct } from '@models/products.dto';
import { convertProductType } from '@utils/stringUtils';
import { isMessage } from '@utils/typescriptHelpers';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import ModifierItem from './ModifierItem';
import ProductItemForm from './ProductItemForm';

const ProductPage = () => {
  const { id: productId } = useParams<{ id: string }>();
  const venueState = useSelector((store: RootState) => store.venue);
  const {
    data: product,
    isLoading,
    isError
  } = useGetProductQuery(
    { productId: productId!, venueId: venueState.id! },
    {
      skip: !productId || !venueState.id
    }
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState(product);

  if (productId && parseInt(productId, 10) === 0) {
    setIsEditing(true);
    setEditedProduct({
      id: 0,
      name: '',
      productType: EProductType.HOT_DRINK,
      description: '',
      imageUrl: '',
      baseCost: 0,
      modifiers: []
    });
  }

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProduct(product);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProduct(product);
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const form = useForm({
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

  if (!productId) {
    return null; // Handle the case where productId is not provided
  }

  if (isLoading) {
    return <div>Loading product...</div>;
  }

  if (isError && isMessage(product)) {
    return <div>Error loading product</div>;
  }

  return (
    <>
      {!isLoading && !isError && product && !isMessage(product) && (
        <div className="form">
          <PageTitleForm
            isEditing={isEditing}
            pageTitle="Product details"
            backRoute={CRoutes.products}
            handleEdit={handleEdit}
            handleCancel={handleCancel}
            handleSave={handleSave}
          />

          {isEditing ? (
            <ProductItemForm form={form} />
          ) : (
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
                      <ModifierItem key={modifier.id} modifier={modifier} />
                    ))}
                  </>
                )}
              </Stack>
            </Flex>
          )}
        </div>
      )}
    </>
  );
};

export default ProductPage;
