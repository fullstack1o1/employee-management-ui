import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hook";
import {
  APIStatus,
  deleteDepartment,
  fetchDepartments,
} from "../store/department.slice";
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
import DepartmentCreate from "../components/DepartmentCreate.component";

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
  const updateDepartmentStatus = useAppSelector(
    (state) => state.departmentSlice.departmentUpdate.status
  );
  // const deleteDepartmentStatus = useAppSelector(
  //   (state) => state.departmentSlice.departmentDelete.status
  // );

  //modal function
  const [open, setOpen] = useState(false);
  const [departments, setDepartments] = useState(allDepartments);
  //state for keeping track of the department to be updated
  const [clickedUpdate, setClickedUpdate] = useState<{
    id: number;
    name: string;
  } | null>(null);
  console.log("allDepartments", allDepartments);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setClickedUpdate(null);
    setOpen(false);
  };

  useEffect(() => {
    dispatch(fetchDepartments());
  }, [createDepartmentStatus, updateDepartmentStatus]);

  //
  useEffect(() => {
    setDepartments(allDepartments);
  }, [allDepartments]);

  const handleDeleteClick = (id: number) => {
    dispatch(deleteDepartment({ id }));
    setDepartments((prev) =>
      prev.filter((departments) => departments.departmentId !== id)
    );
  };

  return (
    <div className="deptList-container">
      {/*display create department button only if the status is not pending*/}
      {allDepartmentsStatus !== APIStatus.PENDING && (
        <Button onClick={handleOpen}>Create department</Button>
      )}
      <DepartmentCreate
        open={open}
        closeModal={handleClose}
        clickedUpdate={clickedUpdate}
      />
      {allDepartmentsStatus === APIStatus.PENDING &&
      departments.length === 0 ? (
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
              {departments.map((dept) => (
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
                    align="right"
                    sx={{ padding: "normal" }}
                  >
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                          if (dept.departmentId) {
                            handleDeleteClick(dept.departmentId);
                          }
                        }}
                      >
                        Delete
                      </Button>

                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => {
                          setClickedUpdate({
                            id: dept.departmentId ?? 0,
                            name: dept.departmentName ?? "",
                          });
                          setOpen(true);
                        }}
                      >
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
