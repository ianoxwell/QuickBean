import { createFormContext } from '@mantine/form';
import { IModifier } from '@models/modifier.dto';

export const [ModifierFormProvider, useModifierFormContext, useModifierForm] = createFormContext<IModifier>();
