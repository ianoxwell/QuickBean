import { IUserToken } from '@models/user.dto';
import { IOrder } from '@models/order.dto';
import { addUserToLocalStorage, getUserFromLocalStorage, removeUserFromLocalStorage } from '@utils/localStorage';
import { createSlice } from '@reduxjs/toolkit';
import { notifications } from '@mantine/notifications';

export interface IUserState {
  isMember: boolean;
  user: IUserToken | undefined;
  previousOrders: IOrder[];
}

const initialState: IUserState = {
  isMember: true,
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
    toggleIsMember: (state) => {
      state.isMember = !state.isMember;
    },
    logoutUser: (state) => {
      state.user = undefined;
      removeUserFromLocalStorage();
      notifications.show({ message: 'You have been logged out' });
    }
  }
});

export const { setUser, toggleIsMember, logoutUser } = userSlice.actions;
export default userSlice.reducer;
