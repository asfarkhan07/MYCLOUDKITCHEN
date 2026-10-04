import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/auth";


//GET /browse/kitchens -> { kitchens }
export const getKitchens = createAsyncThunk(
  "browse/kitchens",
  async (__, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/browse/kitchens");
      return data.kitchens;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "kitchen fetching failed",
      );
    }
  },
);

export const getAllMenuItems = createAsyncThunk(
  "browse/menuItems",
  async (kitchens, { rejectWithValue }) => {
    try {
      const menuResponses = await Promise.all(
        kitchens.map((kitchen) =>
          api.get(`/browse/kitchens/${encodeURIComponent(kitchen._id || kitchen.id)}/menu`),
        ),
      );
      return menuResponses.flatMap(({ data }) => data.menu || []);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Menu item fetching failed",
      );
    }
  },
);

export const getMenuByKitchen = createAsyncThunk(
  "browse/menuByKitchen",
  async (kitchenId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(
        `/browse/kitchens/${encodeURIComponent(kitchenId)}/menu`,
      );
      return { kitchenId: String(kitchenId), menu: data.menu || [] };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Menu item fetching failed",
      );
    }
  },
);

const initialState = {
  kitchens: [],
  menus: [],
  loading: false,
  error: null,
  menusLoading: false,
  menusError: null,
  selectedKitchenMenus: [],
  selectedKitchenMenuId: null,
  selectedKitchenMenuLoading: false,
  selectedKitchenMenuError: null,
};

const browseSlice = createSlice({
  name: "browse",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getKitchens.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getKitchens.fulfilled, (state, action) => {
        state.kitchens = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(getKitchens.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(getAllMenuItems.pending, (state) => {
        state.menusLoading = true;
        state.menusError = null;
      })
      .addCase(getAllMenuItems.fulfilled, (state, action) => {
        state.menus = action.payload;
        state.menusLoading = false;
        state.menusError = null;
      })
      .addCase(getAllMenuItems.rejected, (state, action) => {
        state.menusLoading = false;
        state.menusError = action.payload || action.error.message;
      })
      .addCase(getMenuByKitchen.pending, (state, action) => {
        state.selectedKitchenMenuId = String(action.meta.arg);
        state.selectedKitchenMenus = [];
        state.selectedKitchenMenuLoading = true;
        state.selectedKitchenMenuError = null;
      })
      .addCase(getMenuByKitchen.fulfilled, (state, action) => {
        if (state.selectedKitchenMenuId !== action.payload.kitchenId) return;

        state.selectedKitchenMenus = action.payload.menu;
        state.selectedKitchenMenuLoading = false;
        state.selectedKitchenMenuError = null;
      })
      .addCase(getMenuByKitchen.rejected, (state, action) => {
        if (state.selectedKitchenMenuId !== String(action.meta.arg)) return;

        state.selectedKitchenMenuLoading = false;
        state.selectedKitchenMenuError = action.payload || action.error.message;
      });
  },
});

export const { clearError } = browseSlice.actions;
export default browseSlice.reducer;