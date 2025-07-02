import { useGetActiveModifiersQuery } from '@app/apiSlice';
import { RootState } from '@app/store';
import { Combobox, InputBase, Text, useCombobox } from '@mantine/core';
import { IModifier, IProductModifier } from '@models/modifier.dto';
import { useSelector } from 'react-redux';
import { useProductFormContext } from './productFormContext';

const ProductAddModifier = () => {
  const form = useProductFormContext();
  const formValues = form.getValues();
  const existingModifierNames = formValues.modifiers.map((modifier) => modifier.name);
  const venueState = useSelector((store: RootState) => store.venue);

  const { data: modifiers } = useGetActiveModifiersQuery(venueState.id!, {
    skip: !venueState.id
  });
  const modifierList = modifiers?.map((modifier) => modifier.name) || [];
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex('active')
  });
  const onAddModifier = (modifierName: string) => {
    const modifier: IModifier | undefined = modifiers?.find((mod) => mod.name === modifierName);
    if (!modifier) {
      console.error('Modifier not found:', modifierName);
      return;
    }

    const productModifier: IProductModifier = {
      ...modifier,
      options: modifier.options.map((option) => ({
        ...option,
        priceAdjustment: option.priceAdjustment || 0 // Ensure priceAdjustment is defined
      })),
      order: formValues.modifiers.length + 1
    };
    const modifierFormValues = [...formValues.modifiers, productModifier];
    form.setFieldValue('modifiers', modifierFormValues);
    existingModifierNames.push(modifierName);

    // Reset the combobox after adding the modifier
    combobox.closeDropdown();
    combobox.resetSelectedOption();
  };

  const options = modifierList
    .filter((item) => !existingModifierNames.includes(item))
    .map((item) => (
      <Combobox.Option value={item} key={item} active={existingModifierNames.includes(item)}>
        {item}
      </Combobox.Option>
    ));

  return (
    <div>
      <Text mb={0}>Add existing modifier</Text>
      <Combobox store={combobox} withinPortal={false} onOptionSubmit={onAddModifier}>
        <Combobox.Target>
          <InputBase
            component="button"
            type="button"
            title="Add existing modifier"
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

export default ProductAddModifier;
