import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Api, type EmployeeRequest, type EmployeeResponse } from "../myApi";
import { APIStatus, type IApiResponse } from "./department.slice";

interface IState {
  employees: IApiResponse<EmployeeResponse[]>;
  createEmployee: IApiResponse<EmployeeResponse>;
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
  createEmployee: { data: {}, status: APIStatus.IDLE },
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
export const createEmployee = createAsyncThunk<
  EmployeeResponse,
  EmployeeRequest
>("employee/createEmployee", async (employeeData: EmployeeRequest) => {
  const res = await api.employee.multipartCreate(employeeData);
  console.log(res.data);
  return res.data;
});

export const employeeSlice = createSlice({
  name: "emp",
  initialState,
  reducers: {},
  extraReducers(builder) {
    //fetch employees
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
      })
      //create employee
      .addCase(createEmployee.pending, (state) => {
        state.createEmployee.status = APIStatus.PENDING;
      })
      .addCase(createEmployee.rejected, (state) => {
        state.createEmployee.status = APIStatus.FAILED;
        state.createEmployee.error = "Some Error Occured";
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.createEmployee.status = APIStatus.FULLFILLED;
        state.createEmployee.data = action.payload;
        state.employees.data.push(action.payload); // Add new employee to the list
      });
  },
});

employeeSlice.actions = {
  fetchEmployees,
  createEmployee,
};

export default employeeSlice.reducer;
