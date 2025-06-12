import { configureStore } from "@reduxjs/toolkit";
import { departmentSlice } from "./department.slice";

export const store = configureStore({
  reducer: {
    departmentSlice: departmentSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
