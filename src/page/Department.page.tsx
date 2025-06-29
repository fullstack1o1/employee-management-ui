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
        <DepartmentList
          departments={allDepartments}
          onDelete={handleDeleteClick}
          onUpdate={handleUpdateClick}
          activeDepartmentId={activeDepartmentId}
          activeAction={activeAction}
        />
      )}
    </div>
  );
};
export default Department;
