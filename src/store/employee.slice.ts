import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Api, type EmployeeRequest, type EmployeeResponse } from "../myApi";
import { APIStatus, type IApiResponse } from "./department.slice";

interface IState {
  employees: IApiResponse<EmployeeResponse[]>;
  createEmployee: IApiResponse<EmployeeResponse>;
  updateEmployee: IApiResponse<EmployeeResponse>;
  deleteEmployee: IApiResponse<void>;
}

const api = new Api({
  baseUrl:
    "https://employee-app.whitewater-d0b6f62a.westeurope.azurecontainerapps.io/api",
});

const initialState: IState = {
  employees: { data: [], status: APIStatus.IDLE },
  createEmployee: { data: {}, status: APIStatus.IDLE },
  updateEmployee: { data: {}, status: APIStatus.IDLE },
  deleteEmployee: { data: undefined, status: APIStatus.IDLE },
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
// create a new employee
export const createEmployee = createAsyncThunk<
  EmployeeResponse,
  EmployeeRequest
>("employee/createEmployee", async (employeeData: EmployeeRequest) => {
  const res = await api.employee.multipartCreate(employeeData);
  console.log(res.data);
  return res.data;
});
// delete employee by its ID
export const deleteEmployee = createAsyncThunk(
  "employee/deleteEmployee",
  async ({ id }: { id: number }) => {
    const res = await api.employee.employeeDelete(id);
    return res.data;
  }
);

// update employee by its ID
export const updateEmployee = createAsyncThunk<
  EmployeeResponse,
  { id: number; employeeData: EmployeeRequest }
>("employee/updateEmployee", async ({ id, employeeData }) => {
  const res = await api.employee.employeeUpdate(id, employeeData);
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
        state.employees.data.push(action.payload);
      })
      //update employee
      .addCase(updateEmployee.pending, (state) => {
        state.updateEmployee.status = APIStatus.PENDING;
      })
      .addCase(updateEmployee.rejected, (state) => {
        state.updateEmployee.status = APIStatus.FAILED;
        state.updateEmployee.error = "Some Error Occured";
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.updateEmployee.status = APIStatus.FULLFILLED;
        state.updateEmployee.data = action.payload;
        // Update the employee in the list
        const index = state.employees.data.findIndex(
          (emp) => emp.employeeId === action.payload.employeeId
        );
        if (index !== -1) {
          state.employees.data[index] = action.payload;
        }
      })
      //delete employee
      .addCase(deleteEmployee.pending, (state) => {
        state.deleteEmployee.status = APIStatus.PENDING;
      })
      .addCase(deleteEmployee.rejected, (state) => {
        state.deleteEmployee.status = APIStatus.FAILED;
        state.deleteEmployee.error = "Some Error Occured";
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.deleteEmployee.status = APIStatus.FULLFILLED;
        state.deleteEmployee.data = action.payload;
        state.employees.data = state.employees.data.filter(
          (emp) => emp.employeeId !== action.meta.arg.id
        );
      });
  },
});

employeeSlice.actions = {
  fetchEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};

export default employeeSlice.reducer;
