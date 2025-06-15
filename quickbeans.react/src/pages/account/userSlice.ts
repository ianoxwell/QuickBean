import { CRoutes } from '@app/routes.const';
import { notifications } from '@mantine/notifications';
import { ERole } from '@models/base.dto';
import { IUserToken } from '@models/user.dto';
import { createSlice } from '@reduxjs/toolkit';
import { addUserToLocalStorage, getUserFromLocalStorage, removeUserFromLocalStorage } from '@utils/localStorage';

export interface IVenueUserState {
  user: IUserToken | undefined;
  defaultRoute: string;
}

const userFromStorage = getUserFromLocalStorage();
const initialState: IVenueUserState = {
  user: userFromStorage,
  defaultRoute:
    !userFromStorage?.user?.roles ||
    userFromStorage.user.roles.length === 0 ||
    userFromStorage.user.roles.includes(ERole.KITCHEN)
      ? CRoutes.kitchen
      : CRoutes.dashboard
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
      state.defaultRoute =
        !payload?.user?.roles || payload.user.roles.length === 0 || payload.user.roles.includes(ERole.KITCHEN)
          ? CRoutes.kitchen
          : CRoutes.dashboard;
    },
    setDefaultRoute: (state, { payload }: { payload: string }) => {
      state.defaultRoute = payload;
    },
    logoutUser: (state) => {
      state.user = undefined;
      state.defaultRoute = CRoutes.login; // Reset to login route on logout
      removeUserFromLocalStorage();
      notifications.show({ message: 'You have been logged out' });
    }
  }
});

export const { setUser, setDefaultRoute, logoutUser } = userSlice.actions;
export default userSlice.reducer;
