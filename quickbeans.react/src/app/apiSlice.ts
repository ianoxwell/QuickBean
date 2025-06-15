// Import the RTK Query methods from the React-specific entry point
import { ICheckout, ICheckoutQuery } from '@models/checkout.dto';
import { IMessage } from '@models/message.dto';
import { IOrder } from '@models/order.dto';
import { IUserLogin, IUserToken, IVerifyOneTimeCode } from '@models/user.dto';
import { IVenue, IVenueShort } from '@models/venue.dto';
import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { getUserFromLocalStorage, isTokenFresh } from '@utils/localStorage';

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  prepareHeaders: (headers) => {
    const user = getUserFromLocalStorage();
    const isFresh = isTokenFresh(user?.token, 'exp');

    // If we have a token and its fresh let's assume that we should be passing it.
    if (user && isFresh) {
      headers.set('authorization', `Bearer ${user.token}`);
    }

    return headers;
  }
});
const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  const result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    // TODO - follow this pattern to reauth - https://redux-toolkit.js.org/rtk-query/usage/customizing-queries#automatic-re-authorization-by-extending-fetchbasequery
    // api.dispatch(logoutUser('Not authorized, logging out user'));
  }
  return result;
};

export type Channel = 'events' | 'identity';
export interface Message {
  id: number;
  channel: Channel;
  userName: string;
  text: string;
}

// Define our single API slice object
export const apiSlice = createApi({
  // The cache reducer expects to be added at `state.api` (already default - this is optional)
  reducerPath: 'api',
  // All of our requests will check if token is available and attach (baseQuery) and all responses will be checked for 401 not authorized
  baseQuery: baseQueryWithReauth,
  // The "endpoints" represent operations and requests for this server
  endpoints: (builder) => ({
    getVenueShort: builder.query<IVenueShort, string>({
      query: (slug) => ({ url: `/venue/short?slug=${slug}`, method: 'GET' }),
      keepUnusedDataFor: Number.MAX_VALUE, // Keeps data "forever"
    }),
    getVenueFull: builder.mutation<IVenue, { venueId: number; userId: number }>({
      query: (ids) => ({ url: `/venue`, method: 'POST', body: ids })
    }),
    loginExistingUser: builder.query<IVerifyOneTimeCode | IMessage, string>({
      query: (email) => ({ url: `/user/existing?email=${email}`, method: 'GET' })
    }),
    verifyOneTimeCode: builder.mutation<IUserToken | IMessage, IUserLogin>({
      query: (emailToken) => ({ url: '/user/verify-otc', method: 'POST', body: emailToken })
    }),
    getActiveCheckouts: builder.query<ICheckout[], void>({
      query: () => ({ url: 'checkout/active-checkouts' })
    }),
    getCheckout: builder.query<ICheckout | IMessage, ICheckoutQuery>({
      query: (slugs) => ({ url: `checkout?slug=${slugs.slug}&venueSlug=${slugs.venueSlug}` })
    }),
    updateOrderStatus: builder.mutation<IOrder | IMessage, { receiptNumber: string; status: string }>({
      query: (orderData) => ({
        url: 'order/update-order',
        method: 'POST',
        body: orderData
      })
    })
  })
});

// Export the auto-generated hook for the `getPosts` query endpoint
export const {
  useGetVenueShortQuery,
  useGetVenueFullMutation,
  useLazyLoginExistingUserQuery,
  useVerifyOneTimeCodeMutation,
  useGetCheckoutQuery,
  useUpdateOrderStatusMutation
} = apiSlice;
