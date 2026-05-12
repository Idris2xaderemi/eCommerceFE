import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import orderService from '../../services/orderService';


const initialState = {
  orders: [],
  order: null,
  isLoading: false,
  error: null,
};

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      return await orderService.createOrder(orderData);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create order');
    }
  }
);

export const getOrders = createAsyncThunk(
  'orders/getOrders',
  async (_, { rejectWithValue }) => {
    try {
      return await orderService.getOrders();
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to load orders');
    }
  }
);

export const getOrder = createAsyncThunk(
  'orders/getOrder',
  async (id, { rejectWithValue }) => {
    try {
      return await orderService.getOrder(id);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to load order');
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      return await orderService.updateOrderStatus(id, status);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update status');
    }
  }
);

export const confirmDelivery = createAsyncThunk(
  'orders/confirmDelivery',
  async (id, { rejectWithValue }) => {
    try {
      return await orderService.confirmDelivery(id);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to confirm delivery');
    }
  }
);


export const updateVendorItemsStatus = createAsyncThunk(
  'orders/updateVendorItemsStatus',
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      return await orderService.updateVendorItemsStatus(orderId, status);
    } catch (error) {

      const msg = error.response?.data?.message || error.message || 'Failed to update items';
      return rejectWithValue(msg);
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.order = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => { state.isLoading = true; })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload.order;
        state.orders.push(action.payload.order);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.orders = action.payload.orders;
      })
      .addCase(getOrder.fulfilled, (state, action) => {
        state.order = action.payload.order;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.order = action.payload.order;
        const idx = state.orders.findIndex(o => o._id === action.payload.order._id);
        if (idx !== -1) state.orders[idx] = action.payload.order;
      })
      .addCase(confirmDelivery.pending, (state) => { state.isLoading = true; })
      .addCase(confirmDelivery.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload.order;
        const idx = state.orders.findIndex(o => o._id === action.payload.order._id);
        if (idx !== -1) state.orders[idx] = action.payload.order;
      })
      .addCase(confirmDelivery.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // ---- VENDOR ITEMS STATUS UPDATE ----
      .addCase(updateVendorItemsStatus.pending, (state) => { state.isLoading = true; })
      .addCase(updateVendorItemsStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedOrder = action.payload.order;
        state.order = updatedOrder;
        const idx = state.orders.findIndex(o => o._id === updatedOrder._id);
        if (idx !== -1) state.orders[idx] = updatedOrder;
      })
      .addCase(updateVendorItemsStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;