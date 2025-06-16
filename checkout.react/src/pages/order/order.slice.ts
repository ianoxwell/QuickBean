import { EBookingStatus } from '@models/base.dto';
import { ICheckout } from '@models/checkout.dto';
import { IOrder, IOrderItem } from '@models/order.dto';
import { createSlice } from '@reduxjs/toolkit';
import { calcOrderItemPrice, calcOrderTotal } from '@utils/costCalculator';
import { addOrderToLocalStorage, getOrderFromLocalStorage, removeOrderFromLocalStorage } from '@utils/localStorage';
import { calculateItemCount } from '@utils/numberUtils';
import { generateRandomUniqueString } from '@utils/stringUtils';

export interface IOrderState {
  isLoading: boolean;
  order: IOrder | undefined;
  itemCount: number;
}
const initialState: IOrderState = {
  isLoading: false,
  order: getOrderFromLocalStorage(),
  itemCount: calculateItemCount(getOrderFromLocalStorage())
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    addCheckoutItem: (state, { payload }: { payload: { orderItem: IOrderItem; checkout: ICheckout } }) => {
      if (!state.order) {
        state.order = createBlankOrder(payload.checkout);
      }

      const orderItem = payload.orderItem;
      // Ensure the orderItem has a uniqueId
      if (!orderItem.uniqueId) {
        orderItem.uniqueId = generateRandomUniqueString(10, false);
      }

      // Check if the item already exists in the order and that the modifiers are the same
      const existingItemIndex = state.order.items.findIndex(
        (item) =>
          (item.id === orderItem.id &&
            item.productId === orderItem.productId &&
            JSON.stringify(item.selectedModifiers) === JSON.stringify(orderItem.selectedModifiers)) ||
          item.uniqueId === orderItem.uniqueId
      );
      if (existingItemIndex > -1) {
        // If it exists, just increase the quantity
        state.order.items[existingItemIndex].quantity += orderItem.quantity;
        state.order.items[existingItemIndex].price = calcOrderItemPrice(
          state.order.items[existingItemIndex],
          state.order.items[existingItemIndex].product
        );
      } else {
        // If it doesn't exist, add the new item
        const newItem: IOrderItem = {
          ...orderItem,
          price: calcOrderItemPrice(orderItem, orderItem.product)
        };
        state.order.items.push(newItem);
      }

      // Recalculate the grand total
      state.order.grandTotal = calcOrderTotal(
        state.order.items,
        state.order.items.map((item) => item.product)
      );
      // Set the order date to now if it's a new order
      if (!state.order.id) {
        state.order.orderDate = new Date().toISOString();
      }

      // Ensure the order has a receipt number
      if (!state.order.receiptNumber) {
        state.order.receiptNumber = `R-${generateRandomUniqueString(6)}`; // Generate a simple receipt number
      }

      // Ensure the order has a booking status
      state.order.bookingStatus = EBookingStatus.PENDING;
      // Update the item count
      state.itemCount = calculateItemCount(state.order);
      addOrderToLocalStorage(state.order);
    },
    removeCheckoutItem: (state, { payload }: { payload: { itemUniqueId: string; checkout: ICheckout } }) => {
      if (!state.order) return;

      // Find the index of the item to remove
      const itemIndex = state.order.items.findIndex((item) => item.uniqueId && item.uniqueId === payload.itemUniqueId);
      if (itemIndex > -1) {
        // Remove the item from the order
        state.order.items.splice(itemIndex, 1);

        // Recalculate the grand total
        state.order.grandTotal = calcOrderTotal(
          state.order.items,
          state.order.items.map((item) => item.product)
        );

        // If no items left, reset the order
        if (state.order.items.length === 0) {
          state.order = createBlankOrder(payload.checkout);
        }

        // Update the item count
        state.itemCount = calculateItemCount(state.order);
        addOrderToLocalStorage(state.order);
      }
    },
    modifyCheckoutItem: (state, { payload }: { payload: IOrderItem }) => {
      if (!state.order || !payload.uniqueId) return;

      // Find the index of the item to modify
      const itemIndex = state.order.items.findIndex((item) => item.uniqueId && item.uniqueId === payload.uniqueId);
      if (itemIndex > -1) {
        if (payload.quantity <= 0) {
          // If quantity is 0 or less, remove the item
          state.order.items.splice(itemIndex, 1);
        } else {
          // Update the item with new values
          const existingItem = state.order.items[itemIndex];
          existingItem.quantity = payload.quantity;
          existingItem.selectedModifiers = payload.selectedModifiers;
          existingItem.price = calcOrderItemPrice(existingItem, existingItem.product);
        }
        // Recalculate the grand total
        state.order.grandTotal = calcOrderTotal(
          state.order.items,
          state.order.items.map((item) => item.product)
        );

        // Update the item count
        state.itemCount = calculateItemCount(state.order);
        addOrderToLocalStorage(state.order);
      }
    },
    setCheckoutOrder: (state, { payload }: { payload: IOrder }) => {
      state.order = payload;
      // Ensure the order has a receipt number if not already set
      if (!state.order.receiptNumber) {
        state.order.receiptNumber = `R-${generateRandomUniqueString(6)}`; // Generate a simple receipt number
      }

      // Ensure the order has a booking status
      state.order.bookingStatus = state.order.bookingStatus ?? EBookingStatus.PENDING;
      // Update the item count
      state.itemCount = calculateItemCount(state.order);
      addOrderToLocalStorage(state.order);
    },

    clearCheckout: (state) => {
      state.order = undefined;
      state.itemCount = 0;
      state.isLoading = false;
      removeOrderFromLocalStorage();
    },
    setLoading: (state, { payload }: { payload: boolean }) => {
      state.isLoading = payload;
    }
  }
});

const createBlankOrder = (checkout?: ICheckout): IOrder => ({
  amountPaid: 0,
  grandTotal: 0,
  items: [],
  bookingStatus: EBookingStatus.PENDING,
  venueId: checkout?.venue?.id,
  venue: checkout?.venue,
  checkoutId: checkout?.id,
  checkout: checkout
});

export const { addCheckoutItem, removeCheckoutItem, modifyCheckoutItem, setCheckoutOrder, clearCheckout, setLoading } =
  orderSlice.actions;

export default orderSlice.reducer;
