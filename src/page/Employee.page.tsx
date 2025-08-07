import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hook";
import { fetchEmployees } from "../store/employee.slice";
import { APIStatus } from "../store/department.slice";
import {
  Button,
  Stack,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EmpList from "../components/EmpList.component";
import EmployeeCreate from "../components/EmployeeCreate.component";

const Employee = () => {
  const dispatch = useAppDispatch();
  const empList = useAppSelector((state) => state.employeeSlice.employees.data);
  const empStatus = useAppSelector(
    (state) => state.employeeSlice.employees.status
  );

  const [open, setOpen] = useState(false);
  const [clickedUpdate, setClickedUpdate] = useState<{
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    hireDate: string;
    salary: number;
    managerId: number;
    jobId: number;
    departmentId: number;
  } | null>(null);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setClickedUpdate(null);
  };

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  return (
    <Box sx={{ p: 3 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Typography variant="h4" component="h1">
          Employee Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
          sx={{ minWidth: 160 }}
        >
          Create Employee
        </Button>
      </Stack>

      {empStatus === APIStatus.PENDING ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <EmpList empList={empList} />
      )}

      <EmployeeCreate
        open={open}
        closeModal={handleClose}
        clickedUpdate={clickedUpdate}
      />
    </Box>
  );
};

export default Employee;
