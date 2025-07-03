import { createFormContext } from '@mantine/form';
import { ICheckout } from '@models/checkout.dto';

export const [CheckoutFormProvider, useCheckoutFormContext, useCheckoutForm] = createFormContext<ICheckout>();
