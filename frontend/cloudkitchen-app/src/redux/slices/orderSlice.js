import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/auth.js";

export const getMyUsersOrders = createAsyncThunk(
  "orders/getMyOrders",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/orders/my");
      return data.orders || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to fetch your orders.",
      );
    }
  },
);

export const getMyAdminOrders = createAsyncThunk(
  "orders/getMyAdminOrders",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/admin/orders");
      return data.orders || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to fetch admin orders.",
      );
    }
  },
);

// POST /api/orders
// body: { kitchenId, items:[{ menuItem,quantity }], deliveryAddress, paymentMethod }
export const placeOrder = createAsyncThunk(
  "orders/placeOrder",
  async (
    { kitchenId, items, deliveryAddress, paymentMethod = "cash_on_delivery" },
    { rejectWithValue },
  ) => {
    try {
      const { data } = await api.post("/orders", {
        kitchenId,
        items,
        deliveryAddress,
        paymentMethod,
      });
      return data.order;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "failed to place order",
      );
    }
  },
);

export const createRazorpayOrder = createAsyncThunk(
  "orders/createRazorpayOrder",
  async (orderDetails, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/orders/razorpay/create", {
        ...orderDetails,
        paymentMethod: "razorpay",
      });
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to start online payment.",
      );
    }
  },
);

export const verifyRazorpayPayment = createAsyncThunk(
  "orders/verifyRazorpayPayment",
  async (paymentDetails, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/orders/razorpay/verify", paymentDetails);
      return data.order;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Unable to verify online payment.",
      );
    }
  },
);

const initialState = {
  orders: [],
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearOrdersError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMyUsersOrders.pending, (state) => {
        state.orders = [];
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyUsersOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.loading = false;
      })
      .addCase(getMyUsersOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.orders.unshift(action.payload);
      })
      .addCase(verifyRazorpayPayment.fulfilled, (state, action) => {
        const existingIndex = state.orders.findIndex(
          (order) => order._id === action.payload._id,
        );
        if (existingIndex === -1) {
          state.orders.unshift(action.payload);
        } else {
          state.orders[existingIndex] = action.payload;
        }
      })
      .addCase(getMyAdminOrders.pending, (state) => {
        state.orders = [];
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyAdminOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.loading = false;
      })
      .addCase(getMyAdminOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
  },
});

export const { clearOrdersError } = orderSlice.actions;
export default orderSlice.reducer;
