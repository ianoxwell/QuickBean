import { Combobox, InputBase, Text, useCombobox } from '@mantine/core';
import { EProductType } from '@models/base.dto';
import { ICheckoutCategoryWithProducts } from '@models/checkout-category.dto';
import { convertProductType } from '@utils/stringUtils';
import { useCheckoutFormContext } from './checkoutFormContext';

const CheckoutAddCategory = () => {
  const form = useCheckoutFormContext();
  const formValues = form.getValues();
  const existingCategoryNames = formValues.categories.map((category) => category.productType);

  const categoryList = Object.values(EProductType) as EProductType[];
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex('active')
  });
  const onAddCategory = (value: string) => {
    // value is the selected option value, which should be a valid EProductType
    const category = value as EProductType;
    if (!Object.values(EProductType).includes(category)) {
      console.error('Category not found:', value);
      return;
    }

    const newCategory: ICheckoutCategoryWithProducts = {
      name: convertProductType(category),
      productType: category,
      order: formValues.categories.length,
      products: []
    };
    const categoryFormValues = [...formValues.categories, newCategory];
    form.setFieldValue('categories', categoryFormValues);

    // Reset the combobox after adding the category
    combobox.closeDropdown();
    combobox.resetSelectedOption();
  };

  const options = categoryList
    .filter((item) => !existingCategoryNames.includes(item))
    .map((item) => (
      <Combobox.Option value={item} key={item} active={existingCategoryNames.includes(item)}>
        {convertProductType(item)}
      </Combobox.Option>
    ));

  return (
    <div>
      <Text mb={0}>Add existing category</Text>
      <Combobox store={combobox} withinPortal={false} onOptionSubmit={onAddCategory}>
        <Combobox.Target>
          <InputBase
            component="button"
            type="button"
            title="Add existing category"
            pointer
            rightSection={<Combobox.Chevron />}
            onClick={() => combobox.toggleDropdown()}
            rightSectionPointerEvents="none"
          ></InputBase>
        </Combobox.Target>
        <Combobox.Dropdown>
          <Combobox.Options>
            {options.length === 0 ? <Combobox.Empty>All options selected</Combobox.Empty> : options}
          </Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>
    </div>
  );
};

export default CheckoutAddCategory;
