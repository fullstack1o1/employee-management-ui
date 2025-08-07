import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  Stack,
} from "@mui/material";
// import { createEmployee, updateEmployee } from "../store/employee.slice";

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
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
  const [employee, setEmployee] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    hireDate: "",
    salary: "" as string | number,
    managerId: "" as string | number,
    jobId: "" as string | number,
    departmentId: "" as string | number,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (clickedUpdate) {
      setEmployee({
        firstName: clickedUpdate.firstName,
        lastName: clickedUpdate.lastName,
        email: clickedUpdate.email,
        phoneNumber: clickedUpdate.phoneNumber,
        hireDate: clickedUpdate.hireDate,
        salary: clickedUpdate.salary,
        managerId: clickedUpdate.managerId,
        jobId: clickedUpdate.jobId,
        departmentId: clickedUpdate.departmentId,
      });
    } else {
      setEmployee({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        hireDate: "",
        salary: "",
        managerId: "",
        jobId: "",
        departmentId: "",
      });
    }
    setErrors({});
  }, [clickedUpdate, open]);

  const handleInputChange = (field: string, value: string | number) => {
    setEmployee((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!employee.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!employee.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!employee.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(employee.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!employee.hireDate) {
      newErrors.hireDate = "Hire date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const employeeData = {
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phoneNumber: employee.phoneNumber || undefined,
      hireDate: employee.hireDate,
      salary: employee.salary ? Number(employee.salary) : undefined,
      managerId: employee.managerId ? Number(employee.managerId) : undefined,
      jobId: employee.jobId ? Number(employee.jobId) : undefined,
      departmentId: employee.departmentId
        ? Number(employee.departmentId)
        : undefined,
    };

    if (clickedUpdate) {
      console.log("Update employee:", employeeData);
    } else {
      console.log("Create employee:", employeeData);
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
      salary: "",
      managerId: "",
      jobId: "",
      departmentId: "",
    });
    setErrors({});
    closeModal();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h5" component="h2" gutterBottom>
          {clickedUpdate ? "Update Employee" : "Create Employee"}
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Stack spacing={2}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                label="First Name"
                value={employee.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                error={!!errors.firstName}
                helperText={errors.firstName}
                required
              />
              <TextField
                fullWidth
                label="Last Name"
                value={employee.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                error={!!errors.lastName}
                helperText={errors.lastName}
                required
              />
            </Box>

            <TextField
              fullWidth
              label="Email"
              type="email"
              value={employee.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
              required
            />

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                label="Phone Number"
                value={employee.phoneNumber}
                onChange={(e) =>
                  handleInputChange("phoneNumber", e.target.value)
                }
              />
              <TextField
                fullWidth
                label="Hire Date"
                type="date"
                value={employee.hireDate}
                onChange={(e) => handleInputChange("hireDate", e.target.value)}
                error={!!errors.hireDate}
                helperText={errors.hireDate}
                InputLabelProps={{
                  shrink: true,
                }}
                required
              />
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                label="Salary"
                type="number"
                value={employee.salary}
                onChange={(e) => handleInputChange("salary", e.target.value)}
                InputProps={{
                  startAdornment: <Typography>$</Typography>,
                }}
              />
              <TextField
                fullWidth
                label="Manager ID"
                type="number"
                value={employee.managerId}
                onChange={(e) => handleInputChange("managerId", e.target.value)}
              />
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                label="Job ID"
                type="number"
                value={employee.jobId}
                onChange={(e) => handleInputChange("jobId", e.target.value)}
              />
              <TextField
                fullWidth
                label="Department ID"
                type="number"
                value={employee.departmentId}
                onChange={(e) =>
                  handleInputChange("departmentId", e.target.value)
                }
              />
            </Box>
          </Stack>

          <Box
            sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}
          >
            <Button onClick={handleClose} variant="outlined">
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              {clickedUpdate ? "Update" : "Create"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default EmployeeCreate;
