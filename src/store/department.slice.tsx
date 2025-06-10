import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Api, type DepartmentResponse } from "../myApi";

export enum APIStatus {
  PENDING,
  FULLFILLED,
  FAILED,
  IDLE,
}
export interface IApiResponse<T> {
  data: T;
  error?: string;
  status: APIStatus;
}

interface IState {
  departments: IApiResponse<DepartmentResponse[]>;
}

const api = new Api({
  baseUrl:
    "https://employee-app.whitewater-d0b6f62a.westeurope.azurecontainerapps.io/api",
});

const initialState: IState = {
  departments: { data: [], status: APIStatus.IDLE },
};

export const fetchDepartments = createAsyncThunk(
  "department/fetchDepartments",
  async () => {
    const res = await api.department.departmentList();
    console.log(res.data);
    return res.data;
  }
);

export const departmentSlice = createSlice({
  name: "department",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      //fetch user posts
      .addCase(fetchDepartments.pending, (state) => {
        state.departments.status = APIStatus.PENDING;
      })
      .addCase(fetchDepartments.rejected, (state) => {
        state.departments.status = APIStatus.FAILED;
        state.departments.error = "Some Error Occured";
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.departments.status = APIStatus.FULLFILLED;
        state.departments.data = action.payload;
      });
  },
});

departmentSlice.actions = {
  fetchDepartments,
};

export default departmentSlice.reducer;
