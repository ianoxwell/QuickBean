// Import the RTK Query methods from the React-specific entry point
import { ICheckout, ICheckoutQuery } from '@models/checkout.dto';
import { IMessage } from '@models/message.dto';
import { IOrder } from '@models/order.dto';
import { INewUser, IOneTimeCodeExpires, IUserLogin, IUserToken } from '@models/user.dto';
import { setCheckout } from '@pages/checkoutSlice';
import { createEntityAdapter, EntityState } from '@reduxjs/toolkit';
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
type EventsMessage = number;
export interface Message {
  id: number;
  channel: Channel;
  userName: string;
  text: string;
}

const messagesAdapter = createEntityAdapter<Message>();

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
    verifyOneTimeCode: builder.mutation<IUserToken | IMessage, IUserLogin>({
      query: (emailToken) => ({ url: '/user/verify-otc', method: 'POST', body: emailToken })
    }),
    payNowCreateOrder: builder.mutation<IMessage, IOrder>({
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

    updateOrderStatus: builder.mutation<IOrder | IMessage, { receiptNumber: string; status: string }>({
      query: (orderData) => ({
        url: 'order/update-order',
        method: 'POST',
        body: orderData
      })
    }),
    getOrderStatusEvents: builder.query<
      { receiptNumber: string; bookingStatus: string }[],
      { receiptNumber: string; userId: number }
    >({
      queryFn: () => ({ data: [] }), // No HTTP fetch, just socket.io
      async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
        const socket: Socket = io(import.meta.env.VITE_WS_URL, {
          transports: ['websocket'],
          autoConnect: true
        });

        try {
          await cacheDataLoaded;

          socket.on('connect', () => {
            // Subscribe to order status updates for this order/user
            socket.emit('subscribeOrder', { receiptNumber: arg.receiptNumber, userId: arg.userId });
          });

          socket.on('orderStatus', (data: { receiptNumber: string; bookingStatus: string }) => {
            updateCachedData((draft) => {
              // Replace or add the latest status for this receiptNumber
              const idx = draft.findIndex((item) => item.receiptNumber === data.receiptNumber);
              if (idx > -1) {
                draft[idx] = data;
              } else {
                draft.push(data);
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
    // getEvents: builder.query<number[], void>({
    //   queryFn: () => ({ data: [] }), // No HTTP fetch, just socket.io
    //   async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
    //     // Connect to the socket.io server
    //     const socket: Socket = io(import.meta.env.VITE_WS_URL, {
    //       transports: ['websocket'],
    //       autoConnect: true
    //     });

    //     try {
    //       await cacheDataLoaded;

    //       socket.on('connect', () => {
    //         // Emit the 'events' event to request data
    //         socket.emit('events', null);
    //       });

    //       socket.on('events', (data: number) => {
    //         updateCachedData((draft) => {
    //           draft.push(data);
    //         });
    //       });
    //     } catch (error) {
    //       console.error('Error setting up Socket.IO:', error);
    //     }

    //     await cacheEntryRemoved;
    //     socket.disconnect();
    //   }
    // }),
    // getMessages: builder.query<EntityState<Message, number>, Channel>({
    //   query: (channel) => `messages/${channel}`,
    //   transformResponse(response: Message[]) {
    //     return messagesAdapter.addMany(messagesAdapter.getInitialState(), response);
    //   },
    //   async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
    //     const ws = new WebSocket(import.meta.env.VITE_WS_URL);
    //     try {
    //       await cacheDataLoaded;

    //       const listener = (event: MessageEvent) => {
    //         const data = JSON.parse(event.data);
    //         if (!isMessage(data) || data.channel !== arg) return;

    //         updateCachedData((draft) => {
    //           messagesAdapter.upsertOne(draft, data);
    //         });
    //       };

    //       ws.addEventListener('message', listener);
    //     } catch (error) {
    //       // Handle any errors that occurred during the cache entry setup
    //       console.error('Error setting up WebSocket:', error);
    //     }
    //     await cacheEntryRemoved;
    //     ws.close();
    //   }
    // })
  })
});

// Export the auto-generated hook for the `getPosts` query endpoint
export const {
  useLoginUserMutation,
  useVerifyOneTimeCodeMutation,
  usePayNowCreateOrderMutation,
  useGetCheckoutQuery,
  // useGetEventsQuery,
  useUpdateOrderStatusMutation,
  useGetOrderStatusEventsQuery
} = apiSlice;
