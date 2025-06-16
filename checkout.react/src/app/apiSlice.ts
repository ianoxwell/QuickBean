// Import the RTK Query methods from the React-specific entry point
import { EBookingStatus } from '@models/base.dto';
import { ICheckout, ICheckoutQuery } from '@models/checkout.dto';
import { IMessage } from '@models/message.dto';
import { IOrder, IOrderSubscription } from '@models/order.dto';
import { INewUser, IOneTimeCodeExpires, IUserLogin, IUserToken, IVerifyOneTimeCode } from '@models/user.dto';
import { setCheckout } from '@pages/checkoutSlice';
import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { getUserFromLocalStorage, isTokenFresh } from '@utils/localStorage';
import { isMessage } from '@utils/typescriptHelpers';
import { io, Socket } from 'socket.io-client';

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
    loginUser: builder.mutation<IOneTimeCodeExpires | IMessage, INewUser>({
      query: (userLogin) => ({ url: '/user/login', method: 'POST', body: userLogin })
    }),
    loginExistingUser: builder.query<IVerifyOneTimeCode | IMessage, string>({
      query: (email) => ({ url: `/user/existing?email=${email}`, method: 'GET' })
    }),
    verifyOneTimeCode: builder.mutation<IUserToken | IMessage, IUserLogin>({
      query: (emailToken) => ({ url: '/user/verify-otc', method: 'POST', body: emailToken })
    }),
    payNowCreateOrder: builder.mutation<IMessage | IOrder, IOrder>({
      query: (order) => ({ url: `order`, method: 'POST', body: order })
    }),
    getCheckout: builder.query<ICheckout | IMessage, ICheckoutQuery>({
      query: (slugs) => ({ url: `checkout?slug=${slugs.slug}&venueSlug=${slugs.venueSlug}` }),
      keepUnusedDataFor: 0,
      async onQueryStarted(queryArgument, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Only dispatch if data is a valid ICheckout (not an error message)
          if (data && !isMessage(data)) {
            dispatch(setCheckout(data));
          }
        } catch {
          // ignore errors
        }
      }
    }),
    getOrderStatusEvents: builder.query<{ receiptNumber: string; status: EBookingStatus }, IOrderSubscription>({
      queryFn: (arg) => ({
        data: { receiptNumber: arg.receiptNumber, status: EBookingStatus.PENDING }
      }), // No HTTP fetch, just socket.io
      async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
        const socket: Socket = io(import.meta.env.VITE_WS_URL + '/events', {
          transports: ['websocket'],
          autoConnect: true
        });

        try {
          await cacheDataLoaded;

          socket.on('connect', () => {
            // Subscribe to order status updates for this order/user
            socket.emit('subscribeOrder', { receiptNumber: arg.receiptNumber, userId: arg.userId });
          });

          socket.on('orderStatus', (data: { receiptNumber: string; status: string }) => {
            updateCachedData((draft) => {
              if (!draft) return;
              if (draft.receiptNumber === data.receiptNumber) {
                draft.status = data.status as EBookingStatus; // Update the status in the cache
              }
            });
          });
        } catch (error) {
          console.error('Error setting up Socket.IO:', error);
        }

        await cacheEntryRemoved;
        // Unsubscribe when cache entry is removed
        socket.emit('unsubscribeOrder');
        socket.disconnect();
      }
    })
  })
});

// Export the auto-generated hook for the `getPosts` query endpoint
export const {
  useLoginUserMutation,
  useLazyLoginExistingUserQuery,
  useVerifyOneTimeCodeMutation,
  usePayNowCreateOrderMutation,
  useGetCheckoutQuery,
  useGetOrderStatusEventsQuery
} = apiSlice;
