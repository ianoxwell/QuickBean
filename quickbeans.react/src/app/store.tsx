import userSlice from '@pages/account/userSlice';
import type { Action, ThunkAction } from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './apiSlice';
import { listenerMiddleware } from './listenerMiddleware';
import venueSlice from './venueSlice';

export const store = configureStore({
  reducer: {
    user: userSlice,
    venue: venueSlice,
    [apiSlice.reducerPath]: apiSlice.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware).concat(apiSlice.middleware)
});
// Typescript additional types https://redux.js.org/tutorials/essentials/part-2-app-structure#creating-the-redux-store
// Infer the type of `store
export type AppStore = typeof store;
export type RootState = ReturnType<AppStore['getState']>;
// Infer the `AppDispatch` type from the store itself
export type AppDispatch = AppStore['dispatch'];
// Define a reusable type describing thunk functions
export type AppThunk<ThunkReturnType = void> = ThunkAction<ThunkReturnType, RootState, unknown, Action>;
