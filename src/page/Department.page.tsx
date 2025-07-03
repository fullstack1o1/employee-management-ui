import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hook";
import {
  APIStatus,
  deleteDepartment,
  fetchDepartments,
} from "../store/department.slice";
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import "./department.css";
import DepartmentCreate from "../components/DepartmentCreate.component";
import DepartmentList from "../components/DepartmentList";

const Department = () => {
  const dispatch = useAppDispatch();

  const allDepartments = useAppSelector(
    (state) => state.departmentSlice.departments.data
  );
  const allDepartmentsStatus = useAppSelector(
    (state) => state.departmentSlice.departments.status
  );

  const deleteDepartmentStatus = useAppSelector(
    (state) => state.departmentSlice.departmentDelete.status
  );
  const updateDepartmentStatus = useAppSelector(
    (state) => state.departmentSlice.departmentUpdate.status
  );
  useEffect(() => {
    if (
      deleteDepartmentStatus === APIStatus.FULLFILLED ||
      updateDepartmentStatus === APIStatus.FULLFILLED
    ) {
      setActiveAction(null);
      setActiveDepartmentId(null);
    }
  }, [deleteDepartmentStatus, updateDepartmentStatus]);

  //modal function
  const [open, setOpen] = useState(false);
  //state for keeping track of the department to be updated
  const [clickedUpdate, setClickedUpdate] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const [activeDepartmentId, setActiveDepartmentId] = useState<number | null>(
    null
  );
  const [activeAction, setActiveAction] = useState<"update" | "delete" | null>(
    null
  );

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setClickedUpdate(null);
    setOpen(false);
    setActiveDepartmentId(null);
    setActiveAction(null);
  };

  useEffect(() => {
    dispatch(fetchDepartments());
  }, []);

  const handleDeleteClick = (id: number) => {
    setActiveDepartmentId(id);
    setActiveAction("delete");
    dispatch(deleteDepartment({ id }));
  };
  const handleUpdateClick = (id: number, name: string) => {
    setActiveDepartmentId(id);
    setActiveAction("update");
    setClickedUpdate({ id, name });
    setOpen(true);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <div>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h5" component="div">
            Department List
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpen}
          >
            Create Department
          </Button>
        </Stack>

        <DepartmentCreate
          open={open}
          closeModal={handleClose}
          clickedUpdate={clickedUpdate}
        />
        {allDepartmentsStatus === APIStatus.PENDING &&
        allDepartments.length === 0 ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight={120}
          >
            <CircularProgress />
          </Box>
        ) : (
          <DepartmentList
            departments={allDepartments}
            onDelete={handleDeleteClick}
            onUpdate={handleUpdateClick}
            activeDepartmentId={activeDepartmentId}
            activeAction={activeAction}
          />
        )}
      </div>
    </Box>
  );
};
export default Department;
