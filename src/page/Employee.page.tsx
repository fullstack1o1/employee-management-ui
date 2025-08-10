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

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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

      <EmployeeCreate open={open} closeModal={handleClose} />

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
        <EmpList empList={empList} />
      )}
    </Box>
  );
};

export default Employee;
