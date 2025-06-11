import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hook";
import { APIStatus, fetchDepartments } from "../store/department.slice";
import {
  Button,
  CircularProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import "./departmentList.css";
import DepartmentAction from "../components/DepartmentAction.component";

const DepartmentList = () => {
  const dispatch = useAppDispatch();

  const allDepartments = useAppSelector(
    (state) => state.departmentSlice.departments.data
  );
  const allDepartmentsStatus = useAppSelector(
    (state) => state.departmentSlice.departments.status
  );
  const createDepartmentStatus = useAppSelector(
    (state) => state.departmentSlice.departmentCreate.status
  );
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => setOpen(false);
  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  useEffect(() => {
    if (createDepartmentStatus === APIStatus.FULLFILLED) {
      dispatch(fetchDepartments());
    }
  }, [createDepartmentStatus]);

  return (
    <div className="deptList-container">
      <Button onClick={handleOpen}>Create department</Button>
      <DepartmentAction open={open} closeModal={handleClose} />
      {allDepartmentsStatus === APIStatus.PENDING ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table aria-label="simple table" className="deptlist-table">
            <TableHead>
              <TableRow>
                <TableCell align="inherit">Department ID</TableCell>
                <TableCell align="inherit">Department name</TableCell>
                <TableCell align="inherit">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allDepartments.map((dept) => (
                <TableRow
                  key={dept.departmentId}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row" align="inherit">
                    {dept.departmentId}
                  </TableCell>
                  <TableCell component="th" scope="row" align="inherit">
                    {dept.departmentName}
                  </TableCell>
                  <TableCell
                    component="th"
                    scope="row"
                    align="inherit"
                    sx={{ padding: "normal" }}
                  >
                    <Stack direction="row" spacing={2}>
                      <Button variant="contained" color="error">
                        Delete
                      </Button>
                      <Button variant="contained" color="success">
                        Update
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};
export default DepartmentList;
