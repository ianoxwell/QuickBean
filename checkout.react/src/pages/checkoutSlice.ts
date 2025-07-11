import { ICheckout } from '@models/checkout.dto';
import { createSlice } from '@reduxjs/toolkit';

const initialState: { checkout: ICheckout | undefined } = {
  checkout: undefined
};

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    setCheckout: (state, { payload }: { payload: ICheckout }) => {
      console.log('set the checkout state', payload);
      state.checkout = payload;
    },
    setPreviewCheckoutData: (state, { payload }: { payload: ICheckout }) => {
      state.checkout = payload;
    },
  },
});

export const { setCheckout, setPreviewCheckoutData } = checkoutSlice.actions;
export default checkoutSlice.reducer;
