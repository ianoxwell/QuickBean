import { useGetModifierQuery } from '@app/apiSlice';
import { CRoutes } from '@app/routes.const';
import BackButton from '@components/BackButton/BackButton.component';
import { Flex } from '@mantine/core';
import { isMessage } from '@utils/typescriptHelpers';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useModifierForm } from './modifierFormContext';
import { IModifier } from '@models/modifier.dto';
import { formRootRule, hasLength, isNotEmpty } from '@mantine/form';
import { useVenueNavigate } from '@app/useVenueNavigate';
import PageTitleForm from '@components/PageTitleForm/PageTitleForm.component';

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
          <p>Name: {modifier.name}</p>
          {/* Add more details as needed */}
        </div>
      )}
    </>
  );
};

export default ModifierPage;
