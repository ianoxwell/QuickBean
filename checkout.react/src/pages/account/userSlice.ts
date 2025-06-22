import { notifications } from '@mantine/notifications';
import { IOrder } from '@models/order.dto';
import { IUserToken } from '@models/user.dto';
import { createSlice } from '@reduxjs/toolkit';
import { addUserToLocalStorage, getUserFromLocalStorage, removeUserFromLocalStorage } from '@utils/localStorage';

export interface IUserState {
  user: IUserToken | undefined;
  previousOrders: IOrder[];
}

const initialState: IUserState = {
  user: getUserFromLocalStorage(),
  previousOrders: []
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, { payload }: { payload: IUserToken | undefined }) => {
      if (!payload) {
        removeUserFromLocalStorage();
        notifications.show({ message: 'User has been logged out' });
      } else {
        addUserToLocalStorage(payload);
      }

      state.user = payload;
    },
    logoutUser: (state) => {
      state.user = undefined;
      removeUserFromLocalStorage();
      notifications.show({ message: 'You have been logged out' });
    }
  }
});

export const { setUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
