import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Api, type DepartmentResponse, type DepartmentRequest } from "../myApi";

export enum APIStatus {
  PENDING,
  FULLFILLED,
  FAILED,
  IDLE,
}
// export const APIStatus = {
//   PENDING: "PENDING",
//   FULLFILLED: "FULLFILLED",
//   FAILED: "FAILED",
//   IDLE: "IDLE",
// } as const;
// export type APIStatus = keyof typeof APIStatus;

export interface IApiResponse<T> {
  data: T;
  error?: string;
  status: APIStatus;
}

interface IState {
  departments: IApiResponse<DepartmentResponse[]>;
  departmentCreate: IApiResponse<DepartmentResponse>;
  departmentDelete: IApiResponse<void>;
}

const api = new Api({
  baseUrl:
    "https://employee-app.whitewater-d0b6f62a.westeurope.azurecontainerapps.io/api",
});

const initialState: IState = {
  departments: { data: [], status: APIStatus.IDLE },
  departmentCreate: { data: {} as DepartmentResponse, status: APIStatus.IDLE },
  departmentDelete: { data: undefined, status: APIStatus.IDLE },
};

export const fetchDepartments = createAsyncThunk(
  "department/fetchDepartments",
  async () => {
    const res = await api.department.departmentList();
    console.log(res.data);
    return res.data;
  }
);
export const createDepartment = createAsyncThunk(
  "department/createDepartment",
  async ({ data }: { data: DepartmentRequest }) => {
    const res = await api.department.departmentCreate(data);
    console.log(res.data);
    return res.data;
  }
);
export const deleteDepartment = createAsyncThunk(
  "department/deleteDepartment",
  async ({ id }: { id: number }) => {
    const res = await api.department.departmentDelete(id);
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
      })
      //create department
      .addCase(createDepartment.pending, (state) => {
        state.departmentCreate.status = APIStatus.PENDING;
      })
      .addCase(createDepartment.rejected, (state) => {
        state.departmentCreate.status = APIStatus.FAILED;
        state.departmentCreate.error = "Some Error Occured";
      })
      .addCase(createDepartment.fulfilled, (state, action) => {
        state.departmentCreate.status = APIStatus.FULLFILLED;
        state.departmentCreate.data = action.payload;
      })
      //delete department
      .addCase(deleteDepartment.pending, (state) => {
        state.departmentDelete.status = APIStatus.PENDING;
      })
      .addCase(deleteDepartment.rejected, (state) => {
        state.departmentDelete.status = APIStatus.FAILED;
        state.departmentDelete.error = "Some Error Occured";
      })
      .addCase(deleteDepartment.fulfilled, (state, action) => {
        state.departmentDelete.status = APIStatus.FULLFILLED;
        state.departmentDelete.data = action.payload;
      });
  },
});

departmentSlice.actions = {
  fetchDepartments,
  createDepartment,
  deleteDepartment,
};

export default departmentSlice.reducer;
