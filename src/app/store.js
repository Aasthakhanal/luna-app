import { configureStore } from "@reduxjs/toolkit";
import { authAPI } from "./authApi";
import authReducer from "../features/auth/authSlice";

const rootReducer = {
  [authAPI.reducerPath]: authAPI.reducer,
  auth: authReducer,
};

const apiMiddlewares = [authAPI.middleware];
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(...apiMiddlewares),
});
