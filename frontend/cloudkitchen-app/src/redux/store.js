import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";

import storage from "../storage";
import authReducer from "./slices/authSlice.js";
import browseReducer from "./slices/browseSlice.js";
import cartReducer from "./slices/cartSlice.js";
import kitchenReducer from "./slices/kitchenSlice.js";
import menuReducer from "./slices/menuSlice.js";
import orderReducer from "./slices/orderSlice.js";

const rootReducers = combineReducers({
  auth: authReducer,
  browse: browseReducer,
  cart: cartReducer,
  kitchen:kitchenReducer,
  menu: menuReducer,
  orders: orderReducer,
});

const persistConfig = {
  key: "cloud-kitchen",
  storage,
  whitelist: ["auth", "kitchen", "cart"],
};

const persistedReducer = persistReducer(persistConfig, rootReducers);

export const store=configureStore({
  reducer:persistedReducer,
  middleware:(getDefaultMiddleware)=>
    getDefaultMiddleware({
      serializableCheck:{
        ignoreActions:[FLUSH,REHYDRATE,PAUSE,PERSIST,PURGE,REGISTER],
      }
    })
})

export const persistor=persistStore(store);
export default store;