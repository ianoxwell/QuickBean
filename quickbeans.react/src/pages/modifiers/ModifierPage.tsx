import { useGetModifierQuery } from '@app/apiSlice';
import { CRoutes } from '@app/routes.const';
import { useVenueNavigate } from '@app/useVenueNavigate';
import PageTitleForm from '@components/PageTitleForm/PageTitleForm.component';
import { Checkbox, Flex, InputLabel, Stack, Text } from '@mantine/core';
import { formRootRule, hasLength, isNotEmpty } from '@mantine/form';
import { IModifier } from '@models/modifier.dto';
import { isMessage } from '@utils/typescriptHelpers';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ModifierFormProvider, useModifierForm } from './modifierFormContext';
import ModifierItemForm from './ModifierItemForm';
import VenueNavLink from '@components/VenueNavLink/VenueNavLink.component';

const ModifierPage = () => {
  const { id: modifierId } = useParams<{ id: string }>();
  const navigate = useVenueNavigate();
  const {
    data: modifier,
    isLoading,
    isError
  } = useGetModifierQuery(modifierId || '', { skip: !modifierId || parseInt(modifierId, 10) === 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [editedModifier, setEditedModifier] = useState(modifier);

  const form = useModifierForm({
    mode: 'uncontrolled',
    initialValues: {
      ...(editedModifier as IModifier)
    },
    validate: {
      name: hasLength({ min: 2, max: 30 }, 'Modifier name must be between 2 and 30 characters long'),
      options: {
        [formRootRule]: isNotEmpty('At least one option is required'),
        label: hasLength({ min: 2, max: 30 }, 'Option label must be between 2 and 30 characters long')
      }
    },
    enhanceGetInputProps() {
      if (!isEditing) {
        return { disabled: true };
      }
    }
  });

  if (
    modifierId &&
    parseInt(modifierId, 10) === 0 &&
    (!editedModifier || (!isMessage(editedModifier) && editedModifier.id !== 0))
  ) {
    const newItem: IModifier = {
      id: 0,
      name: '',
      options: [],
      isRequired: false
    };
    setEditedModifier(newItem);
    form.setValues(newItem);
    setIsEditing(true);
  }

  const handleEdit = () => {
    setIsEditing(true);
    setEditedModifier(modifier);
    form.setValues(modifier as IModifier);
    form.clearErrors();
  };

  const handleCancel = () => {
    if (editedModifier && (editedModifier as IModifier).id === 0) {
      navigate(`/${CRoutes.modifiers}`);
      return;
    }

    setIsEditing(false);
    setEditedModifier(modifier);
  };

  const handleSave = () => {
    form.validate();
    if (!form.isValid()) {
      console.error('Form validation failed', form.errors);
      return;
    }

    setIsEditing(false);
  };

  if (!modifierId) {
    return null; // Handle the case where modifierId is not provided
  }

  if (isLoading) {
    return <div>Loading product...</div>;
  }

  if (isError || isMessage(modifier)) {
    return <div>Error loading product</div>;
  }

  return (
    <>
      {!isLoading && !isError && modifier && !isMessage(modifier) && (
        <div className="form">
          <PageTitleForm
            isEditing={isEditing}
            pageTitle="Modifier details"
            backRoute={CRoutes.modifiers}
            handleEdit={handleEdit}
            handleCancel={handleCancel}
            handleSave={handleSave}
          />
          {isEditing && editedModifier && !isMessage(editedModifier) ? (
            <ModifierFormProvider form={form}>
              <ModifierItemForm />
            </ModifierFormProvider>
          ) : (
            <>
              {modifier && (
                <Flex gap="md" direction={{ base: 'column', sm: 'row' }}>
                  <Stack gap="md" flex={1}>
                    <div>
                      <InputLabel>Modifier name</InputLabel>
                      <Text>{modifier.name}</Text>
                    </div>
                    <Checkbox
                      label="Is required"
                      description="Patron will have to select an option to add to cart"
                      checked={modifier.isRequired}
                      disabled
                    />
                    {modifier.products?.length && (
                      <>
                        <InputLabel>Products this modifier is applied to</InputLabel>
                        {modifier.products.map((product) => (
                          <VenueNavLink
                            path={`${CRoutes.products}/${product.id}`}
                            label={product.name}
                            key={product.id}
                          />
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

export default ModifierPage;
