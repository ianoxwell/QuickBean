// Import the RTK Query methods from the React-specific entry point
import { IMessage } from '@models/message.dto';
import { IModifier } from '@models/modifier.dto';
import { IKitchenOrderSubscription, IOrder } from '@models/order.dto';
import { IProduct, IProductShort } from '@models/products.dto';
import { IUserLogin, IUserToken, IVerifyOneTimeCode } from '@models/user.dto';
import { IVenueShort, IVenueWithProducts } from '@models/venue.dto';
import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { getUserFromLocalStorage, isTokenFresh } from '@utils/localStorage';
import { io, Socket } from 'socket.io-client';
import { logoutUser } from '../pages/account/userSlice';

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
    api.dispatch(logoutUser());
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
  tagTypes: ['Product', 'Venue', 'Modifier', 'Checkout', 'Order'],
  // All of our requests will check if token is available and attach (baseQuery) and all responses will be checked for 401 not authorized
  baseQuery: baseQueryWithReauth,
  // The "endpoints" represent operations and requests for this server
  endpoints: (builder) => ({
    getVenueShort: builder.query<IVenueShort, string>({
      // Venue items
      query: (slug) => ({ url: `/venue/short?slug=${slug}`, method: 'GET' }),
      keepUnusedDataFor: Number.MAX_VALUE // Keeps data "forever"
    }),
    getVenueFull: builder.query<IVenueWithProducts, number>({
      query: (venueId) => ({ url: `/venue`, method: 'POST', body: { venueId } }),
      providesTags: (_result, _error, arg) => [{ type: 'Venue', id: arg }]
    }),
    // User Login items
    loginExistingUser: builder.query<IVerifyOneTimeCode | IMessage, string>({
      query: (email) => ({ url: `/user/existing?email=${email}`, method: 'GET' })
    }),
    verifyOneTimeCode: builder.mutation<IUserToken | IMessage, IUserLogin>({
      query: (emailToken) => ({ url: '/user/verify-otc', method: 'POST', body: emailToken })
    }),
    // Product items
    getActiveProducts: builder.query<IProductShort[], string | number>({
      query: (venueId) => ({ url: `product/active-products?venueId=${venueId}` })
    }),
    getProduct: builder.query<IProduct | IMessage, { venueId: number; productId: number | string }>({
      query: (id) => ({ url: `product?productId=${id.productId}&venueId=${id.venueId}` })
    }),
    // Modifier items
    getActiveModifiers: builder.query<IModifier[], string | number>({
      query: (venueId) => ({ url: `modifier/active-modifiers?venueId=${venueId}` })
    }),
    getModifier: builder.query<IModifier | IMessage, string | number>({
      query: (id) => ({ url: `modifier?modifierId=${id}` })
    }),
    // Order items
    updateOrderStatus: builder.mutation<IOrder | IMessage, { receiptNumber: string; status: string }>({
      query: (orderData) => ({
        url: 'order/update-order',
        method: 'POST',
        body: orderData
      })
    }),
    getOrderStatusEvents: builder.query<IOrder[], IKitchenOrderSubscription>({
      queryFn: () => ({
        data: []
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
            socket.emit('subscribeKitchenOrders', { venueId: arg.venueId, userId: arg.userId });
          });

          socket.on('kitchenOrders', (data: IOrder[]) => {
            updateCachedData((draft) => {
              // Update the cached data with the new order status updates
              data.forEach((order: IOrder) => {
                const existingOrder = draft.find((o) => o.receiptNumber === order.receiptNumber);
                if (existingOrder) {
                  existingOrder.bookingStatus = order.bookingStatus;
                } else {
                  draft.push(order);
                }
              });
            });
          });
        } catch (error) {
          console.error('Error setting up Socket.IO:', error);
        }

        await cacheEntryRemoved;
        // Unsubscribe when cache entry is removed
        socket.emit('unsubscribeKitchenOrder');
        socket.disconnect();
      }
    })
  })
});

// Export the auto-generated hook for the `getPosts` query endpoint
export const {
  useGetVenueShortQuery,
  useLazyGetVenueFullQuery,
  useLazyLoginExistingUserQuery,
  useVerifyOneTimeCodeMutation,
  useGetActiveProductsQuery,
  useGetProductQuery,
  useGetActiveModifiersQuery,
  useGetModifierQuery,
  useUpdateOrderStatusMutation,
  useGetOrderStatusEventsQuery
} = apiSlice;
