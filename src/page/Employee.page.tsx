import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hook";
import { fetchEmployees, deleteEmployee } from "../store/employee.slice";
import { APIStatus } from "../store/department.slice";
import type { EmployeeResponse } from "../myApi";
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
  const deleteEmployeeStatus = useAppSelector(
    (state) => state.employeeSlice.deleteEmployee.status
  );
  const updateEmployeeStatus = useAppSelector(
    (state) => state.employeeSlice.updateEmployee.status
  );

  const [open, setOpen] = useState(false);
  const [activeEmployeeId, setActiveEmployeeId] = useState<number | null>(null);
  const [activeAction, setActiveAction] = useState<"delete" | null>(null);
  const [selectedEmployee, setSelectedEmployee] =
    useState<EmployeeResponse | null>(null);

  // Helper function to extract manager ID
  const getManagerId = (managerId: unknown): number => {
    if (!managerId) return 0;
    if (typeof managerId === "number") return managerId;
    if (
      typeof managerId === "object" &&
      managerId !== null &&
      "id" in managerId
    ) {
      return (managerId as { id: number }).id;
    }
    return 0;
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedEmployee(null);
  };

  const handleDeleteEmployee = (id: number) => {
    setActiveEmployeeId(id);
    setActiveAction("delete");
    dispatch(deleteEmployee({ id }));
  };

  const handleEditEmployee = (id: number) => {
    const employee = empList.find(
      (emp: EmployeeResponse) => emp.employeeId === id
    );
    if (employee) {
      setSelectedEmployee(employee);
      setOpen(true);
    }
  };

  useEffect(() => {
    if (
      deleteEmployeeStatus === APIStatus.FULLFILLED ||
      updateEmployeeStatus === APIStatus.FULLFILLED
    ) {
      setActiveAction(null);
      setActiveEmployeeId(null);
    }
  }, [deleteEmployeeStatus, updateEmployeeStatus]);

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  return (
    <Box
      sx={{
        maxWidth: { xs: "100%", sm: 600 },
        mx: "auto",
        mt: { xs: 2, sm: 4 },
        px: { xs: 1, sm: 0 },
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        mb={2}
        spacing={2}
      >
        {empStatus !== APIStatus.PENDING && (
          <>
            <Typography
              variant="h5"
              component="div"
              sx={{
                textAlign: { xs: "center", sm: "left" },
                fontSize: { xs: "1.1rem", sm: "1.4rem" },
              }}
            >
              Employee List
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpen}
              size="small"
              sx={{
                width: { xs: "100%", sm: "auto" },
                fontSize: { xs: "0.9rem", sm: "1rem" },
                py: { xs: 1, sm: 1.5 },
              }}
            >
              Create Employee
            </Button>
          </>
        )}
      </Stack>

      <EmployeeCreate
        open={open}
        closeModal={handleClose}
        clickedUpdate={
          selectedEmployee
            ? {
                id: selectedEmployee.employeeId || 0,
                firstName: selectedEmployee.firstName || "",
                lastName: selectedEmployee.lastName || "",
                email: selectedEmployee.email || "",
                phoneNumber: selectedEmployee.phoneNumber || "",
                hireDate: selectedEmployee.hireDate || "",
                salary: selectedEmployee.salary || 0,
                managerId: getManagerId(selectedEmployee.managerId),
                jobId: selectedEmployee.jobId || 0,
                departmentId: selectedEmployee.departmentId || 0,
              }
            : null
        }
      />

      {empStatus === APIStatus.PENDING && empList.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 200,
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <EmpList
          empList={empList}
          onDelete={handleDeleteEmployee}
          onEdit={handleEditEmployee}
          activeEmployeeId={activeEmployeeId}
          activeAction={activeAction}
        />
      )}
    </Box>
  );
};

export default Employee;
