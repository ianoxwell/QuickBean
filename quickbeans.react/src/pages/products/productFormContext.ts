import { createFormContext } from '@mantine/form';
import { IProduct } from '@models/products.dto';

export const [ProductFormProvider, useProductFormContext, useProductForm] = createFormContext<IProduct>();
