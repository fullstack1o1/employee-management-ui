import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Api, type EmployeeResponse } from "../myApi";
import { APIStatus, type IApiResponse } from "./department.slice";

interface IState {
  employees: IApiResponse<EmployeeResponse[]>;
}

const api = new Api({
  baseUrl:
    "https://employee-app.whitewater-d0b6f62a.westeurope.azurecontainerapps.io/api",
});

const initialState: IState = {
  //   jobTitles: { data: [], status: APIStatus.IDLE },
  //   createJob: { data: {} as JobTitleResponse, status: APIStatus.IDLE },
  //   deleteJob: { data: undefined, status: APIStatus.IDLE },
  //   updateJob: { data: {} as JobTitleResponse, status: APIStatus.IDLE },
  employees: { data: [], status: APIStatus.IDLE },
};
// fetch all employee list
export const fetchEmployees = createAsyncThunk(
  "employee/fetchEmployees",
  async () => {
    const res = await api.employee.employeeList();
    console.log(res.data);
    return res.data;
  }
);

export const employeeSlice = createSlice({
  name: "emp",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder

      .addCase(fetchEmployees.pending, (state) => {
        state.employees.status = APIStatus.PENDING;
      })
      .addCase(fetchEmployees.rejected, (state) => {
        state.employees.status = APIStatus.FAILED;
        state.employees.error = "Some Error Occured";
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.employees.status = APIStatus.FULLFILLED;
        state.employees.data = action.payload;
      });
  },
});

employeeSlice.actions = {
  fetchEmployees,
};

export default employeeSlice.reducer;
