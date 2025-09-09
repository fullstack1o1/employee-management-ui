// src/components/EmployeeDetails.component.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  IconButton,
  Divider,
  Button,
} from "@mui/material";
import {
  Person,
  ArrowBack,
  Email,
  Phone,
  Work,
  CalendarToday,
  MonetizationOn,
  Business,
} from "@mui/icons-material";

import type { EmployeeResponse } from "../myApi";
import { useAppSelector, useAppDispatch } from "../store/hook";
import { fetchEmployees } from "../store/employee.slice";
import { APIStatus } from "../store/department.slice";

const EmployeeDetails: React.FC = () => {
  const { employeeId } = useParams<{ employeeId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Get employees from Redux store
  const { employees } = useAppSelector((state) => state.employeeSlice);
  const [employee, setEmployee] = useState<EmployeeResponse | null>(null);

  // Fetch employees if not already loaded
  useEffect(() => {
    if (!employees.data || employees.data.length === 0) {
      dispatch(fetchEmployees());
    }
  }, [dispatch, employees.data]);

  useEffect(() => {
    if (employeeId && employees.data) {
      const numericId = Number(employeeId);

      try {
        const foundEmployee = employees.data.find((emp) => {
          return emp.employeeId === numericId;
        });
        setEmployee(foundEmployee || null);
      } catch (error) {
        console.error("Error finding employee:", error);
        setEmployee(null);
      }
    }
  }, [employeeId, employees]);

  // Helper function to get manager name
  const getManagerName = (managerId: unknown): string => {
    if (managerId == null) return "No manager assigned";

    let actualManagerId: number | null = null;

    // Extract the actual manager ID from different formats
    if (typeof managerId === "number") {
      actualManagerId = managerId;
    } else if (
      typeof managerId === "object" &&
      managerId !== null &&
      "id" in managerId
    ) {
      actualManagerId = (managerId as { id: number }).id;
    }

    if (actualManagerId === null) return "Invalid manager data";

    // Find the manager in the employees list
    if (employees.data && employees.data.length > 0) {
      const manager = employees.data.find(
        (emp) => emp.employeeId === actualManagerId
      );
      if (manager) {
        return (
          `${manager.firstName || ""} ${manager.lastName || ""}`.trim() ||
          "Unknown Manager"
        );
      }
    }

    return `Manager not found`;
  };

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  const handleRefresh = () => {
    dispatch(fetchEmployees());
  };

  // Show loading if employees are being fetched
  if (employees.status === APIStatus.PENDING) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6">Loading employee data...</Typography>
      </Box>
    );
  }

  if (!employee && employees.data && employees.data.length > 0) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6">Employee not found</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Employee with ID {employeeId} does not exist
        </Typography>
        <Box sx={{ mt: 2, display: "flex", gap: 2, justifyContent: "center" }}>
          <Button variant="outlined" onClick={handleRefresh}>
            Refresh Data
          </Button>
          <IconButton onClick={handleBack}>
            <ArrowBack /> Back
          </IconButton>
        </Box>
      </Box>
    );
  }

  if (!employee) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6">Loading...</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Data count: {employees.data?.length || 0} employees
        </Typography>
        <Box sx={{ mt: 2, display: "flex", gap: 2, justifyContent: "center" }}>
          <Button variant="outlined" onClick={handleRefresh}>
            Refresh Data
          </Button>
          <IconButton onClick={handleBack}>
            <ArrowBack /> Back
          </IconButton>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
      {/* Header with Back Button */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <IconButton onClick={handleBack} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h5" fontWeight="bold">
          Employee Details
        </Typography>
      </Box>

      {/* Employee Details Card */}
      <Card elevation={3}>
        <CardContent sx={{ p: 4 }}>
          {/* Profile Header */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                mr: 3,
                bgcolor: "primary.main",
                fontSize: "2rem",
              }}
            >
              <Person sx={{ fontSize: "2.5rem" }} />
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {`${employee?.firstName || "Unknown"} ${
                  employee?.lastName || "Employee"
                }`}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Employee ID: {employee?.employeeId || "N/A"}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Employee Information */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 3,
            }}
          >
            {/* Email */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                p: 2,
                bgcolor: "grey.50",
                borderRadius: 2,
                border: "1px solid",
                borderColor: "grey.200",
              }}
            >
              <Email sx={{ mr: 2, color: "primary.main" }} />
              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight="medium"
                >
                  Email Address
                </Typography>
                <Typography variant="body1">
                  {employee?.email || "No email provided"}
                </Typography>
              </Box>
            </Box>

            {/* Phone */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                p: 2,
                bgcolor: "grey.50",
                borderRadius: 2,
                border: "1px solid",
                borderColor: "grey.200",
              }}
            >
              <Phone sx={{ mr: 2, color: "primary.main" }} />
              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight="medium"
                >
                  Phone Number
                </Typography>
                <Typography variant="body1">
                  {employee?.phoneNumber || "Not provided"}
                </Typography>
              </Box>
            </Box>

            {/* Job ID */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                p: 2,
                bgcolor: "grey.50",
                borderRadius: 2,
                border: "1px solid",
                borderColor: "grey.200",
              }}
            >
              <Work sx={{ mr: 2, color: "secondary.main" }} />
              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight="medium"
                >
                  Job ID
                </Typography>
                <Typography variant="body1">
                  {employee?.jobId ? String(employee.jobId) : "Not assigned"}
                </Typography>
              </Box>
            </Box>

            {/* Department ID */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                p: 2,
                bgcolor: "grey.50",
                borderRadius: 2,
                border: "1px solid",
                borderColor: "grey.200",
              }}
            >
              <Business sx={{ mr: 2, color: "secondary.main" }} />
              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight="medium"
                >
                  Department ID
                </Typography>
                <Typography variant="body1">
                  {employee?.departmentId
                    ? String(employee.departmentId)
                    : "Not assigned"}
                </Typography>
              </Box>
            </Box>

            {/* Salary */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                p: 2,
                bgcolor: "grey.50",
                borderRadius: 2,
                border: "1px solid",
                borderColor: "grey.200",
              }}
            >
              <MonetizationOn sx={{ mr: 2, color: "success.main" }} />
              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight="medium"
                >
                  Salary
                </Typography>
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  color="success.main"
                >
                  {employee?.salary
                    ? `DKK ${employee.salary.toLocaleString()}`
                    : "Not specified"}
                </Typography>
              </Box>
            </Box>

            {/* Manager */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                p: 2,
                bgcolor: "grey.50",
                borderRadius: 2,
                border: "1px solid",
                borderColor: "grey.200",
              }}
            >
              <Person sx={{ mr: 2, color: "info.main" }} />
              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight="medium"
                >
                  Manager
                </Typography>
                <Typography variant="body1">
                  {getManagerName(employee?.managerId)}
                </Typography>
              </Box>
            </Box>

            {/* Hire Date */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                p: 2,
                bgcolor: "grey.50",
                borderRadius: 2,
                border: "1px solid",
                borderColor: "grey.200",
              }}
            >
              <CalendarToday sx={{ mr: 2, color: "warning.main" }} />
              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight="medium"
                >
                  Hire Date
                </Typography>
                <Typography variant="body1">
                  {employee?.hireDate
                    ? new Date(employee.hireDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Not specified"}
                </Typography>
              </Box>
            </Box>

            {/* Start Date */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                p: 2,
                bgcolor: "grey.50",
                borderRadius: 2,
                border: "1px solid",
                borderColor: "grey.200",
              }}
            >
              <CalendarToday sx={{ mr: 2, color: "warning.main" }} />
              <Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight="medium"
                >
                  Start Date
                </Typography>
                <Typography variant="body1">
                  {employee?.hireDate
                    ? new Date(employee.hireDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Not specified"}
                </Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default EmployeeDetails;
