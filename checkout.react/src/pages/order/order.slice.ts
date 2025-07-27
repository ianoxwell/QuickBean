import { EOrderStatus } from '@models/base.dto';
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

      const { orderItem, checkout } = payload;

      // Check if the item already exists in the order by comparing product and modifiers
      const existingItemIndex = state.order.items.findIndex(
        (item) =>
          item.productId === orderItem.productId &&
          JSON.stringify(item.selectedModifiers) === JSON.stringify(orderItem.selectedModifiers)
      );

      const product = checkout.categories.flatMap((c) => c.products).find((p) => p.id === orderItem.productId);

      if (existingItemIndex > -1) {
        // If it exists, just increase the quantity
        const existingItem = state.order.items[existingItemIndex];
        existingItem.quantity += orderItem.quantity;
        existingItem.price = calcOrderItemPrice(existingItem, product);
      } else {
        // If it doesn't exist, add the new item with a uniqueId
        const newItem: IOrderItem = {
          ...orderItem,
          uniqueId: generateRandomUniqueString(10, false),
          price: 0 // Initialize price
        };
        newItem.price = calcOrderItemPrice(newItem, product);
        state.order.items.push(newItem);
      }

      // Recalculate the grand total
      state.order.grandTotal = calcOrderTotal(
        state.order.items,
        checkout.categories.flatMap((c) => c.products)
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
      state.order.bookingStatus = EOrderStatus.PENDING;
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
          payload.checkout.categories.flatMap((c) => c.products)
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
      // Guard against missing order or payload
      if (!state.order || !payload || !payload.uniqueId) {
        return;
      }

      // The checkout object on IOrder is typed as ICheckoutShort, but we store the full ICheckout object at runtime.
      const checkout = state.order.checkout as unknown as ICheckout;
      if (!checkout || !checkout.categories) {
        // Cannot proceed without the full product list
        return;
      }

      const itemIndex = state.order.items.findIndex((item) => item.uniqueId === payload.uniqueId);

      if (itemIndex > -1) {
        const allProducts = checkout.categories.flatMap((c) => c.products);
        const existingItem = state.order.items[itemIndex];
        const product = allProducts.find((p) => p.id === existingItem.productId);

        if (!product) {
          console.error(`Product with ID ${existingItem.productId} not found in checkout data.`);
          return;
        }

        if (payload.quantity <= 0) {
          // If quantity is 0 or less, remove the item
          state.order.items.splice(itemIndex, 1);
        } else {
          // Update the item with new values
          existingItem.quantity = payload.quantity;
          existingItem.selectedModifiers = payload.selectedModifiers;
          existingItem.price = calcOrderItemPrice(existingItem, product);
        }
        // Recalculate the grand total
        state.order.grandTotal = calcOrderTotal(state.order.items, allProducts);

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
      state.order.bookingStatus = state.order.bookingStatus ?? EOrderStatus.PENDING;
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
  bookingStatus: EOrderStatus.PENDING,
  venueId: checkout?.venue?.id,
  venue: checkout?.venue,
  checkoutId: checkout?.id,
  checkout: checkout
});

export const { addCheckoutItem, removeCheckoutItem, modifyCheckoutItem, setCheckoutOrder, clearCheckout, setLoading } =
  orderSlice.actions;

export default orderSlice.reducer;
