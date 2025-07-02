import { CIconSizes } from '@app/appGlobal.const';
import BackButton from '@components/BackButton/BackButton.component';
import { Button, Divider, Flex } from '@mantine/core';
import { Edit, Save, X } from 'lucide-react';

const PageTitleForm = ({
  isEditing,
  pageTitle,
  backRoute,
  isFormValid = true,
  handleSave,
  handleCancel,
  handleEdit
}: {
  isEditing: boolean;
  pageTitle: string;
  backRoute: string;
  isFormValid?: boolean;
  handleSave: () => void;
  handleCancel: () => void;
  handleEdit: () => void;
}) => {
  return (
    <>
      <Flex justify="space-between" align="center">
        <Flex gap="md" align="center">
          <BackButton back={backRoute} />
          <h1>{pageTitle}</h1>
        </Flex>
        {isEditing ? (
          <Flex gap="md" direction={{ base: 'column', sm: 'row' }}>
            <Button type="button" color="teal.9" onClick={handleSave} disabled={!isFormValid} leftSection={<Save size={CIconSizes.medium} />}>
              Save
            </Button>
            <Button type="button" color="gray.7" onClick={handleCancel} leftSection={<X size={CIconSizes.medium} />}>
              Cancel
            </Button>
          </Flex>
        ) : (
          <Button type="button" onClick={handleEdit} leftSection={<Edit size={CIconSizes.medium} />}>
            Edit
          </Button>
        )}
      </Flex>
      <Divider my="md" />
    </>
  );
};

export default PageTitleForm;
