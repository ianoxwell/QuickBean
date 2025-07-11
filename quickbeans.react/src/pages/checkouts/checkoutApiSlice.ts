import { apiSlice } from '@app/apiSlice';
import { ICheckout, ICheckoutQuery, ICheckoutShort } from '@models/checkout.dto';
import { IMessage } from '@models/message.dto';

export const checkoutApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getActiveCheckouts: builder.query<ICheckoutShort[], string | number>({
      query: (venueId) => ({ url: `checkout/active-checkouts?venueId=${venueId}` }),
      providesTags: ['Checkout']
    }),
    getCheckout: builder.query<ICheckout | IMessage, ICheckoutQuery>({
      query: (slugs) => ({ url: `checkout?slug=${slugs.slug}&venueSlug=${slugs.venueSlug}` }),
      providesTags: (_result, _error, arg) => [{ type: 'Checkout', id: arg.slug }]
    }),
    updateCheckout: builder.mutation<ICheckout, Partial<ICheckout>>({
      query: (checkout) => ({
        url: 'checkout',
        method: 'POST',
        body: checkout
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: 'Checkout', id: arg.slug }, 'Checkout']
    })
  })
});

export const { useGetActiveCheckoutsQuery, useGetCheckoutQuery, useUpdateCheckoutMutation } = checkoutApiSlice;
