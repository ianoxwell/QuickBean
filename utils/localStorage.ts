import { IOrder } from '@models/order.dto';
import { IUserToken } from '@models/user.dto';

export const CLocalStorageKeys = { user: 'qb-user', order: 'qb-order' };

// User methods
export const addUserToLocalStorage = (userToken: IUserToken) => {
  localStorage.setItem(CLocalStorageKeys.user, JSON.stringify(userToken));
};

export const removeUserFromLocalStorage = () => {
  localStorage.removeItem(CLocalStorageKeys.user);
};

export const getUserFromLocalStorage = (): IUserToken | undefined => {
  const result = localStorage.getItem(CLocalStorageKeys.user);
  const user = typeof result === 'string' && result.includes('{') ? (JSON.parse(result) as IUserToken) : undefined;
  if (!user || !user.token || !isTokenFresh(user.token)) {
    return undefined;
  }

  return user;
};

// Order storage

export const addOrderToLocalStorage = (order: IOrder) => {
  localStorage.setItem(CLocalStorageKeys.order, JSON.stringify(order));
};
export const removeOrderFromLocalStorage = () => {
  localStorage.removeItem(CLocalStorageKeys.order);
};

export const getOrderFromLocalStorage = (): IOrder | undefined => {
  const result = localStorage.getItem(CLocalStorageKeys.order);
  const order = typeof result === 'string' && result.includes('{') ? (JSON.parse(result) as IOrder) : undefined;
  if (!order || !order.items || order.items.length === 0 || !order.orderDate) {
    localStorage.removeItem(CLocalStorageKeys.order);
    return undefined;
  }

  // check the date is within the last 24 hours
  const orderDate = new Date(order.orderDate);
  if (isNaN(orderDate.getTime()) || Date.now() - orderDate.getTime() > 24 * 60 * 60 * 1000) {
    localStorage.removeItem(CLocalStorageKeys.order);
    return undefined;
  }

  return order;
};

/** Decodes the token, parses and attempts to cast to T. */
const decodeToken = (token: string) => {
  return JSON.parse(atob(token.split('.')[1]));
};

/** Decodes the jwt token and compares to current time to see if the token is still fresh. */
export const isTokenFresh = (token: string | undefined, expiryKey = 'exp'): boolean => {
  if (!token) {
    return false;
  }

  const expiryString = decodeToken(token)[expiryKey] as unknown as string;
  const expiry = new Date(expiryString).getTime() * 1000;

  return new Date().getTime() < expiry;
};
