import { configureStore } from "@reduxjs/toolkit";

import { departmentSlice } from "./department.slice";
import { jobSlice } from "./job.slice";

export const store = configureStore({
  reducer: {
    departmentSlice: departmentSlice.reducer,
    jobSlice: jobSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
