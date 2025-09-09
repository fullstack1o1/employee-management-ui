import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  createEmployee,
  updateEmployee,
  fetchEmployees,
} from "../store/employee.slice";
import { fetchJobTitles } from "../store/job.slice";
import { fetchDepartments } from "../store/department.slice";
import { useAppDispatch, useAppSelector } from "../store/hook";
import type {
  EmployeeResponse,
  JobTitleResponse,
  DepartmentResponse,
} from "../myApi";

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: "80%", md: 600 },
  maxWidth: 600,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: { xs: 2, sm: 3, md: 4 },
  maxHeight: "90vh",
  overflow: "auto",
};

type EmployeeCreateModalProps = {
  open: boolean;
  closeModal: () => void;
  clickedUpdate?: {
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
  } | null;
};

const EmployeeCreate: React.FC<EmployeeCreateModalProps> = ({
  open,
  closeModal,
  clickedUpdate,
}) => {
  const dispatch = useAppDispatch();

  // Get data from Redux store
  const { employees } = useAppSelector((state) => state.employeeSlice);
  const { jobTitles } = useAppSelector((state) => state.jobSlice);
  const { departments } = useAppSelector((state) => state.departmentSlice);

  // Fetch data when component mounts
  useEffect(() => {
    dispatch(fetchEmployees());
    dispatch(fetchJobTitles());
    dispatch(fetchDepartments());
  }, [dispatch]);

  const [employee, setEmployee] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    hireDate: "",
    startDate: "",
    salary: "" as string | number,
    managerId: "" as string | number,
    jobId: "" as string | number,
    departmentId: "" as string | number,
  });

  const [salaryError, setSalaryError] = useState("");

  useEffect(() => {
    if (open) {
      if (clickedUpdate) {
        // Edit mode - pre-fill with existing data
        setEmployee({
          firstName: clickedUpdate.firstName || "",
          lastName: clickedUpdate.lastName || "",
          email: clickedUpdate.email || "",
          phoneNumber: clickedUpdate.phoneNumber || "",
          hireDate: clickedUpdate.hireDate || "",
          startDate: clickedUpdate.hireDate || "",
          salary: clickedUpdate.salary || "",
          managerId: clickedUpdate.managerId || "",
          jobId: clickedUpdate.jobId || "",
          departmentId: clickedUpdate.departmentId || "",
        });
      } else {
        // Create mode - reset to empty
        setEmployee({
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          hireDate: "",
          startDate: "",
          salary: "",
          managerId: "",
          jobId: "",
          departmentId: "",
        });
      }
      setSalaryError("");
    }
  }, [open, clickedUpdate]);

  // Get salary range for selected job
  const getSalaryRange = () => {
    if (!employee.jobId || !jobTitles.data) return null;
    const job = jobTitles.data.find(
      (j: JobTitleResponse) => j.jobId === Number(employee.jobId)
    );
    return job ? { min: job.minSalary, max: job.maxSalary } : null;
  };

  // Validate salary against job range
  const validateSalary = (salary: string | number) => {
    if (!salary || !employee.jobId) return "";

    const range = getSalaryRange();
    if (!range || range.min === undefined || range.max === undefined) return "";

    const salaryNum = Number(salary);
    if (salaryNum < range.min) {
      return `Minimum salary: DKK ${range.min.toLocaleString()}`;
    }
    if (salaryNum > range.max) {
      return `Maximum salary: DKK ${range.max.toLocaleString()}`;
    }
    return "";
  };

  const handleInputChange = (field: string, value: string | number) => {
    setEmployee((prev) => ({ ...prev, [field]: value }));
    // When job changes, clear salary and error
    if (field === "jobId") {
      setEmployee((prev) => ({ ...prev, salary: "" }));
      setSalaryError("");
    }

    // Validate salary when it changes
    if (field === "salary" && employee.jobId) {
      setSalaryError(validateSalary(value));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Final validation
    if (employee.salary && employee.jobId) {
      const error = validateSalary(employee.salary);
      if (error) {
        setSalaryError(error);
        return;
      }
    }

    const employeeData = {
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phoneNumber: employee.phoneNumber || undefined,
      hireDate: employee.hireDate,
      startDate: employee.startDate || undefined,
      salary: employee.salary ? Number(employee.salary) : undefined,
      managerId: employee.managerId ? Number(employee.managerId) : undefined,
      jobId: employee.jobId ? Number(employee.jobId) : undefined,
      departmentId: employee.departmentId
        ? Number(employee.departmentId)
        : undefined,
    };

    if (clickedUpdate) {
      // Update existing employee
      dispatch(updateEmployee({ id: clickedUpdate.id, employeeData }));
    } else {
      // Create new employee
      dispatch(createEmployee(employeeData));
    }

    closeModal();
  };

  const handleClose = () => {
    setEmployee({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      hireDate: "",
      startDate: "",
      salary: "",
      managerId: "",
      jobId: "",
      departmentId: "",
    });
    setSalaryError("");
    closeModal();
  };

  // Helper text for salary field
  const getSalaryHelperText = () => {
    if (!employee.jobId) return "Select a job title first";
    if (salaryError) return salaryError;
    const range = getSalaryRange();
    return range && range.min !== undefined && range.max !== undefined
      ? `Salary range: DKK ${range.min.toLocaleString()} - ${range.max.toLocaleString()}`
      : "";
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h5" component="h2" gutterBottom>
          {clickedUpdate ? "Update Employee" : "Create Employee"}
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Stack spacing={2}>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
              }}
            >
              <TextField
                fullWidth
                label="First Name"
                value={employee.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                required
              />
              <TextField
                fullWidth
                label="Last Name"
                value={employee.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                required
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
              }}
            >
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={employee.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />
              <TextField
                fullWidth
                label="Phone Number"
                value={employee.phoneNumber}
                onChange={(e) =>
                  handleInputChange("phoneNumber", e.target.value)
                }
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
              }}
            >
              <TextField
                fullWidth
                label="Hire Date"
                type="date"
                value={employee.hireDate}
                onChange={(e) => handleInputChange("hireDate", e.target.value)}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                required
              />
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                value={employee.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
              }}
            >
              <TextField
                fullWidth
                label="Salary"
                type="number"
                value={employee.salary}
                onChange={(e) => handleInputChange("salary", e.target.value)}
                disabled={!employee.jobId}
                error={!!salaryError}
                helperText={getSalaryHelperText()}
                slotProps={{
                  input: {
                    startAdornment: <Typography>DKK</Typography>,
                  },
                }}
              />
              <FormControl fullWidth>
                <InputLabel>Manager</InputLabel>
                <Select
                  value={employee.managerId}
                  label="Manager"
                  onChange={(e) =>
                    handleInputChange("managerId", e.target.value)
                  }
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {employees.data &&
                    employees.data.map((emp: EmployeeResponse) => (
                      <MenuItem key={emp.employeeId} value={emp.employeeId}>
                        {emp.firstName} {emp.lastName}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
              }}
            >
              <FormControl fullWidth>
                <InputLabel>Job Title</InputLabel>
                <Select
                  value={employee.jobId}
                  label="Job Title"
                  onChange={(e) => handleInputChange("jobId", e.target.value)}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {jobTitles.data &&
                    jobTitles.data.map((job: JobTitleResponse) => (
                      <MenuItem key={job.jobId} value={job.jobId}>
                        {job.title}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Department</InputLabel>
                <Select
                  value={employee.departmentId}
                  label="Department"
                  onChange={(e) =>
                    handleInputChange("departmentId", e.target.value)
                  }
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {departments.data &&
                    departments.data.map((dept: DepartmentResponse) => (
                      <MenuItem
                        key={dept.departmentId}
                        value={dept.departmentId}
                      >
                        {dept.departmentName}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Box>
          </Stack>

          <Box
            sx={{
              mt: 3,
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "flex-end",
              gap: 2,
            }}
          >
            <Button
              onClick={handleClose}
              variant="outlined"
              sx={{
                width: { xs: "100%", sm: "auto" },
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={!!salaryError}
              sx={{
                width: { xs: "100%", sm: "auto" },
              }}
            >
              {clickedUpdate ? "Update" : "Create"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default EmployeeCreate;
