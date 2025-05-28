// Import the RTK Query methods from the React-specific entry point

import { ICheckout, ICheckoutQuery } from '@models/checkout.dto';
import { IMessage } from '@models/message.dto';
import { INewUser, IResetPasswordRequest, IUserLogin, IUserToken, IVerifyUserEmail } from '@models/user.dto';
import { setCheckout } from '@pages/checkoutSlice';
import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { getUserFromLocalStorage, isTokenFresh } from '@utils/localStorage';
import { isMessage } from '@utils/typescriptHelpers';

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

// Define our single API slice object
export const apiSlice = createApi({
  // The cache reducer expects to be added at `state.api` (already default - this is optional)
  reducerPath: 'api',
  // All of our requests will check if token is available and attach (baseQuery) and all responses will be checked for 401 not authorized
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Schedules'],
  // The "endpoints" represent operations and requests for this server
  endpoints: (builder) => ({
    loginUser: builder.mutation<IUserToken | IMessage, IUserLogin>({
      query: (userLogin) => ({ url: '/account/login', method: 'POST', body: userLogin })
    }),
    registerUser: builder.mutation<IUserToken | IMessage, INewUser>({
      query: (newUser) => ({ url: '/account/register', method: 'POST', body: newUser })
    }),
    verifyUserEmail: builder.mutation<IUserToken | IMessage, IVerifyUserEmail>({
      query: (emailToken) => ({ url: '/account/verify-email', method: 'POST', body: emailToken })
    }),
    forgotPasswordEmail: builder.mutation<IMessage, string>({
      query: (email) => ({ url: '/account/forgot-password', method: 'POST', body: { email } })
    }),
    resetPassword: builder.mutation<IUserToken | IMessage, IResetPasswordRequest>({
      query: (reset) => ({ url: '/account/reset-password', method: 'POST', body: reset })
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
    })
  })
});

// Export the auto-generated hook for the `getPosts` query endpoint
export const {
  useLoginUserMutation,
  useRegisterUserMutation,
  useVerifyUserEmailMutation,
  useForgotPasswordEmailMutation,
  useResetPasswordMutation,
  useGetCheckoutQuery
} = apiSlice;
