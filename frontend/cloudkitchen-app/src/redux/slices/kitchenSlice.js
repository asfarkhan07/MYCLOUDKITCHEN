import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/auth";
import { logout } from "./authSlice.js";

//POST /api/auth/createKitchen -> { message }
//GET /api/auth/getKitchen ->{ message,kitchen }
export const CreateKitchen = createAsyncThunk(
  "/kitchen/createkitchen",
  async (
    {
      name,
      description,
      cuisineType,
      city,
      state,
      country,
      contactNumber,
      deliveryRadius,
      status,
      image,
    },
    { rejectWithValue },
  ) => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("cuisineType", cuisineType);
      formData.append("city", city);
      formData.append("state", state);
      formData.append("country", country);
      formData.append("contactNumber", contactNumber);
      formData.append("deliveryRadius", deliveryRadius);
      formData.append("status", status);
      if (image) formData.append("image", image);

      const { data } = await api.post("/auth/createkitchen", formData);
      const createdKitchen = data.kitchen;
      return { createdKitchen };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Kitchen save failed",
      );
    }
  },
);

export const getMyKitchens = createAsyncThunk(
  "kitchen/Mykitchens",
  async (__, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/admin/kitchens/Mykitchens");
      return data.kitchens;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "kitchen fetching failed",
      );
    }
  },
);

export const getKitchen = createAsyncThunk(
  "kitchen/:kitchenId",
  async (kitchenId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(
        `/admin/kitchens/${encodeURIComponent(kitchenId)}`,
      );
      return data.kitchen;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Fetching kitchen failed",
      );
    }
  },
);



const initialState = {
  kitchens: [],
  kitchen: {},
  loading: false,
  error: null,
};

const kitchenSlice = createSlice({
  name: "kitchen",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logout, () => initialState)
      
      //getMyKitchens
      .addCase(getMyKitchens.pending,(state)=>{
        state.loading=true;
        state.error=null;
      })
      .addCase(getMyKitchens.fulfilled,(state,action)=>{
        state.loading=false;
        state.kitchens=action.payload;
      })
      .addCase(getMyKitchens.rejected,(state,action)=>{
        state.loading=false;
        state.error=action.payload;
      })

      //getKitchen
      .addCase(getKitchen.pending,(state)=>{
        state.loading=true;
        state.error=null;
      })
      .addCase(getKitchen.fulfilled,(state,action)=>{
        state.loading=false;
        state.kitchen=action.payload;
      })
      .addCase(getKitchen.rejected,(state,action)=>{
        state.loading=false;
        state.error=action.payload;
      })
  },
});

export const { clearError }=kitchenSlice.actions;
export default kitchenSlice.reducer;