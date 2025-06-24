import BackButton from '@components/BackButton/BackButton.component';
import { Button, Divider, Flex } from '@mantine/core';
import { Edit, Save, X } from 'lucide-react';

const PageTitleForm = ({
  isEditing,
  pageTitle,
  backRoute,
  handleSave,
  handleCancel,
  handleEdit
}: {
  isEditing: boolean;
  pageTitle: string;
  backRoute: string;
  handleSave: () => void;
  handleCancel: () => void;
  handleEdit: () => void;
}) => {
  const iconSize = 16;
  return (
    <>
      <Flex justify="space-between" align="center">
        <Flex gap="md" align="center">
          <BackButton back={backRoute} />
          <h1>{pageTitle}</h1>
        </Flex>
        {isEditing ? (
          <Flex gap="md" direction={{ base: 'column', sm: 'row' }}>
            <Button type="button" color="green.9" onClick={handleSave} leftSection={<Save size={iconSize} />}>
              Save
            </Button>
            <Button type="button" color="gray.6" onClick={handleCancel} leftSection={<X size={iconSize} />}>
              Cancel
            </Button>
          </Flex>
        ) : (
          <Button type="button" onClick={handleEdit} leftSection={<Edit size={iconSize} />}>
            Edit
          </Button>
        )}
      </Flex>
      <Divider my="md" />
    </>
  );
};

export default PageTitleForm;
