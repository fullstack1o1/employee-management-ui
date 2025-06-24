import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hook";
import {
  APIStatus,
  deleteDepartment,
  fetchDepartments,
} from "../store/department.slice";
import { Button, CircularProgress } from "@mui/material";
import "./departmentList.css";
import DepartmentCreate from "../components/DepartmentCreate.component";
import DepartmentTable from "../components/DepartmentTable";

const DepartmentList = () => {
  const dispatch = useAppDispatch();

  const allDepartments = useAppSelector(
    (state) => state.departmentSlice.departments.data
  );
  const allDepartmentsStatus = useAppSelector(
    (state) => state.departmentSlice.departments.status
  );
  //modal function
  const [open, setOpen] = useState(false);
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
  }, []);

  const handleDeleteClick = (id: number) => {
    dispatch(deleteDepartment({ id }));
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
      allDepartments.length === 0 ? (
        <div className="circular-progress">
          <CircularProgress />
        </div>
      ) : (
        <DepartmentTable
          departments={allDepartments}
          onDelete={handleDeleteClick}
          onUpdate={(id, name) => {
            setClickedUpdate({ id, name });
            setOpen(true);
          }}
        />
      )}
    </div>
  );
};
export default DepartmentList;
