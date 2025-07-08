import { configureStore } from "@reduxjs/toolkit";
import { authAPI } from "./authApi";
import { userAPI } from "./userApi";
import authReducer from "../features/auth/authSlice";
import { periodDaysApi } from "./periodDaysApi";
import { cyclesApi } from "./cyclesApi";

const rootReducer = {
  [authAPI.reducerPath]: authAPI.reducer,
  [userAPI.reducerPath]: userAPI.reducer,
  [periodDaysApi.reducerPath]: periodDaysApi.reducer,
  [cyclesApi.reducerPath]: cyclesApi.reducer,
  auth: authReducer,
};

const apiMiddlewares = [
  authAPI.middleware,
  userAPI.middleware,
  periodDaysApi.middleware,
  cyclesApi.middleware,
]; // userAPI.middleware

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(...apiMiddlewares),
});
