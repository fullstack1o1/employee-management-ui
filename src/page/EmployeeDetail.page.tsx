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
import { fetchDepartments, APIStatus } from "../store/department.slice";
import { fetchJobTitles } from "../store/job.slice";

const EmployeeDetails: React.FC = () => {
  const { employeeId } = useParams<{ employeeId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { employees } = useAppSelector((state) => state.employeeSlice);
  const { departments } = useAppSelector((state) => state.departmentSlice);
  const { jobTitles } = useAppSelector((state) => state.jobSlice);
  const [employee, setEmployee] = useState<EmployeeResponse | null>(null);

  // Fetch employees, departments, and job titles if not loaded
  useEffect(() => {
    if (!employees.data?.length) {
      dispatch(fetchEmployees());
    }
    if (!departments.data?.length) {
      dispatch(fetchDepartments());
    }
    if (!jobTitles.data?.length) {
      dispatch(fetchJobTitles());
    }
  }, [dispatch, employees.data, departments.data, jobTitles.data]);

  // Find specific employee
  useEffect(() => {
    if (employeeId && employees.data) {
      const numericId = Number(employeeId);
      const foundEmployee = employees.data.find(
        (emp) => emp.employeeId === numericId
      );
      setEmployee(foundEmployee || null);
    }
  }, [employeeId, employees.data]);

  // Helper function to get manager name
  const getManagerName = (managerId: unknown): string => {
    if (!managerId) return "No manager assigned";

    const actualManagerId =
      typeof managerId === "number"
        ? managerId
        : (managerId as { id?: number })?.id;

    if (!actualManagerId) return "Invalid manager data";

    const manager = employees.data?.find(
      (emp) => emp.employeeId === actualManagerId
    );
    return manager
      ? `${manager.firstName || ""} ${manager.lastName || ""}`.trim() ||
          "Unknown Manager"
      : "Manager not found";
  };

  // Helper function to get department name
  const getDepartmentName = (departmentId: unknown): string => {
    if (!departmentId) return "No department assigned";

    const actualDepartmentId =
      typeof departmentId === "number" ? departmentId : Number(departmentId);

    if (!actualDepartmentId || isNaN(actualDepartmentId))
      return "Invalid department data";

    const department = departments.data?.find(
      (dept) => dept.departmentId === actualDepartmentId
    );
    return department?.departmentName || "Department not found";
  };

  // Helper function to get job title name
  const getJobTitleName = (jobId: unknown): string => {
    if (!jobId) return "No job assigned";

    const actualJobId = typeof jobId === "number" ? jobId : Number(jobId);

    if (!actualJobId || isNaN(actualJobId)) return "Invalid job data";

    const job = jobTitles.data?.find((job) => job.jobId === actualJobId);
    return job?.title || "Job not found";
  };

  const handleBack = () => navigate(-1);
  const handleRefresh = () => {
    dispatch(fetchEmployees());
    dispatch(fetchDepartments());
    dispatch(fetchJobTitles());
  };

  // Helper component for info cards
  const InfoCard = ({
    icon,
    label,
    value,
    color = "primary.main",
  }: {
    icon: React.ReactNode;
    label: string;
    value: string;
    color?: string;
  }) => (
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
      <Box sx={{ mr: 2, color, display: "flex", alignItems: "center" }}>
        {icon}
      </Box>
      <Box>
        <Typography variant="body2" color="text.secondary" fontWeight="medium">
          {label}
        </Typography>
        <Typography
          variant="body1"
          color={label === "Salary" ? "success.main" : "inherit"}
          fontWeight={label === "Salary" ? "bold" : "normal"}
        >
          {value}
        </Typography>
      </Box>
    </Box>
  );

  // Loading component
  const LoadingState = ({
    message,
    showDataCount = false,
  }: {
    message: string;
    showDataCount?: boolean;
  }) => (
    <Box sx={{ p: 3, textAlign: "center" }}>
      <Typography variant="h6">{message}</Typography>
      {showDataCount && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Data count: {employees.data?.length || 0} employees
        </Typography>
      )}
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

  // Show loading if employees are being fetched
  if (employees.status === APIStatus.PENDING) {
    return <LoadingState message="Loading employee data..." />;
  }

  // Employee not found but data exists
  if (!employee && employees.data?.length > 0) {
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

  // Still loading or no employee
  if (!employee) {
    return <LoadingState message="Loading..." showDataCount={true} />;
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
            <InfoCard
              icon={<Email />}
              label="Email Address"
              value={employee?.email || "No email provided"}
            />

            <InfoCard
              icon={<Phone />}
              label="Phone Number"
              value={employee?.phoneNumber || "Not provided"}
            />

            <InfoCard
              icon={<Work />}
              label="Job Title"
              value={getJobTitleName(employee?.jobId)}
              color="secondary.main"
            />

            <InfoCard
              icon={<Business />}
              label="Department"
              value={getDepartmentName(employee?.departmentId)}
              color="secondary.main"
            />

            <InfoCard
              icon={<MonetizationOn />}
              label="Salary"
              value={
                employee?.salary
                  ? `DKK ${employee.salary.toLocaleString()}`
                  : "Not specified"
              }
              color="success.main"
            />

            <InfoCard
              icon={<Person />}
              label="Manager"
              value={getManagerName(employee?.managerId)}
              color="info.main"
            />

            <InfoCard
              icon={<CalendarToday />}
              label="Hire Date"
              value={
                employee?.hireDate
                  ? new Date(employee.hireDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Not specified"
              }
              color="warning.main"
            />

            <InfoCard
              icon={<CalendarToday />}
              label="Start Date"
              value={
                employee?.hireDate
                  ? new Date(employee.hireDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Not specified"
              }
              color="warning.main"
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default EmployeeDetails;
