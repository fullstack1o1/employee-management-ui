import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hook";
import { APIStatus, fetchDepartments } from "../store/department.slice";
import { CircularProgress } from "@mui/material";

const DepartmentList = () => {
  const dispatch = useAppDispatch();
  const allDepartments = useAppSelector(
    (state) => state.departmentSlice.departments.data
  );
  const allDepartmentsStatus = useAppSelector(
    (state) => state.departmentSlice.departments.status
  );
  useEffect(() => {
    dispatch(fetchDepartments());
  }, []);

  return (
    <div>
      <h2>Departments</h2>
      {allDepartmentsStatus === APIStatus.PENDING ? (
        <CircularProgress />
      ) : (
        <ul>
          {allDepartments.map((dept) => (
            <li key={dept.departmentId}>{dept.departmentName}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DepartmentList;
