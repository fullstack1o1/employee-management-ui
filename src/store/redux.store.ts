import { configureStore } from "@reduxjs/toolkit";

import { departmentSlice } from "./department.slice";
import { jobSlice } from "./job.slice";
import { employeeSlice } from "./employee.slice";

export const store = configureStore({
  reducer: {
    departmentSlice: departmentSlice.reducer,
    jobSlice: jobSlice.reducer,
    employeeSlice: employeeSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
