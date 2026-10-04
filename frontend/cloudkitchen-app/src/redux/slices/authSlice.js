import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/auth.js";


//POST /api/auth/login -> { message,token }
// GET /api/auth/profile -> {message,user}
export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);

      let user = data.user;

      if (!user) {
        try {
          const profileResponse = await api.get("/auth/profile");
          user = profileResponse.data.user;
        } catch {
          user = {
            email,
            username: email.split("@")[0],
            role: "user",
          };
        }
      }

      return { user, token: data.token };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "login failed");
    }
  },
);

//POST /api/auth/register -> { message,user }
export const register = createAsyncThunk(
  "auth/register",
  async ({ username, email, password, role = "user" }, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/register", {
        username,
        email,
        password,
        role,
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  },
);

//GET /api/auth/profile -> { message,user }
export const fetchProfile = createAsyncThunk(
  "auth/profile",
  async (__, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/auth/profile");
      return data.user;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "profile fetching failed",
      );
    }
  },
);

//PUT /api/auth/updateprofile -> { message,user }
export const updateProfile = createAsyncThunk(
  "auth/updateprofile",
  async (updates, { rejectWithValue }) => {
    try {
      const { data } = await api.put("/auth/updateprofile", updates);
      return data.user;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "profile update failed",
      );
    }
  },
);

const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      //login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })

      //register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.isAuthenticated = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error =action.payload;
        state.isAuthenticated = false;
      })

      //fetchProfile
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
        //token was likely Invalid or expired
        state.token = null;
        state.isAuthenticated = false;
      })

      //UpdateProfile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
