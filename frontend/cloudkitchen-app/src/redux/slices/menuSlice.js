import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/auth.js";
import { logout } from "./authSlice.js";

const getMenuKitchenId = (menuItem) =>
	String(menuItem?.kitchen?._id || menuItem?.kitchen?.id || menuItem?.kitchen || "");

export const fetchMenuForOwner = createAsyncThunk(
	"menu/fetchMenuForOwner",
	async (kitchenId, { rejectWithValue }) => {
		try {
			const { data } = await api.get(
				`/admin/menu/${encodeURIComponent(kitchenId)}`,
			);
			return data.menuItems;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message || "Failed to fetch menu items",
			);
		}
	},
);

export const createMenu = createAsyncThunk(
	"menu/createMenu",
	async ({ kitchenId, menuData }, { rejectWithValue }) => {
		try {
			const { data } = await api.post(
				`/admin/menu/${encodeURIComponent(kitchenId)}`,
				menuData,
			);
			return data.menuItem;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message || "Failed to create menu item",
			);
		}
	},
);

const initialState = {
	menuItems: [],
	loading: false,
	error: null,
};

const menuSlice = createSlice({
	name: "menu",
	initialState,
	reducers: {
		clearMenuError: (state) => {
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(logout, () => initialState)
			.addCase(fetchMenuForOwner.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchMenuForOwner.fulfilled, (state, action) => {
				state.loading = false;
				const kitchenId = String(action.meta.arg);
				state.menuItems = state.menuItems.filter(
					(item) => getMenuKitchenId(item) !== kitchenId,
				);
				state.menuItems.push(...action.payload);
			})
			.addCase(fetchMenuForOwner.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			})
			.addCase(createMenu.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(createMenu.fulfilled, (state, action) => {
				state.loading = false;
				const menuItemId = String(action.payload._id || action.payload.id);
				const existingIndex = state.menuItems.findIndex(
					(item) => String(item._id || item.id) === menuItemId,
				);
				if (existingIndex === -1) {
					state.menuItems.push(action.payload);
				} else {
					state.menuItems[existingIndex] = action.payload;
				}
			})
			.addCase(createMenu.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});
	},
});

export const { clearMenuError } = menuSlice.actions;
export default menuSlice.reducer;
