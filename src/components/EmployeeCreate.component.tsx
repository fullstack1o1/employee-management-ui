import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import type {
  DepartmentResponse,
  EmployeeDocumentRequestFromEmployee,
  EmployeeResponse,
  JobTitleResponse,
} from '../myApi';
import { fetchDepartments } from '../store/department.slice';
import {
  createEmployee,
  fetchEmployees,
  updateEmployee,
} from '../store/employee.slice';
import { useAppDispatch, useAppSelector } from '../store/hook';
import { fetchJobTitles } from '../store/job.slice';

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: '80%', md: 600 },
  maxWidth: 600,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: { xs: 2, sm: 3, md: 4 },
  maxHeight: '90vh',
  overflow: 'auto',
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
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    hireDate: '',
    startDate: '',
    salary: '' as string | number,
    managerId: '' as string | number,
    jobId: '' as string | number,
    departmentId: '' as string | number,
  });

  const [salaryError, setSalaryError] = useState('');
  const [startDateError, setStartDateError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState('');

  useEffect(() => {
    if (open) {
      if (clickedUpdate) {
        // Edit mode - pre-fill with existing data
        setEmployee({
          firstName: clickedUpdate.firstName || '',
          lastName: clickedUpdate.lastName || '',
          email: clickedUpdate.email || '',
          phoneNumber: clickedUpdate.phoneNumber || '',
          hireDate: clickedUpdate.hireDate || '',
          startDate: clickedUpdate.hireDate || '',
          salary: clickedUpdate.salary || '',
          managerId: clickedUpdate.managerId || '',
          jobId: clickedUpdate.jobId || '',
          departmentId: clickedUpdate.departmentId || '',
        });
      } else {
        // Create mode - reset to empty
        setEmployee({
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          hireDate: '',
          startDate: '',
          salary: '',
          managerId: '',
          jobId: '',
          departmentId: '',
        });
      }
      setSalaryError('');
      setStartDateError('');
      setEmailError('');
      setSelectedFile(null);
      setFileError('');
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
    if (!salary || !employee.jobId) return '';

    const range = getSalaryRange();
    if (!range || range.min === undefined || range.max === undefined) return '';

    const salaryNum = Number(salary);
    if (salaryNum < range.min) {
      return `Minimum salary: DKK ${range.min.toLocaleString()}`;
    }
    if (salaryNum > range.max) {
      return `Maximum salary: DKK ${range.max.toLocaleString()}`;
    }
    return '';
  };

  // Validate start date against hire date
  const validateStartDate = (startDate: string, hireDate: string) => {
    if (!startDate || !hireDate) return '';

    const startDateObj = new Date(startDate);
    const hireDateObj = new Date(hireDate);

    if (startDateObj < hireDateObj) {
      return 'Start date cannot be before hire date';
    }
    return '';
  };

  // Validate email format
  const validateEmail = (email: string) => {
    if (!email) return '';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  // Handle file upload with validation
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      // Check if the file is allowed (PDF, Word, Text files)
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'text/csv',
        'text/xml',
        'application/json',
      ];
      const fileExtension = file.name.toLowerCase().split('.').pop();
      const allowedExtensions = [
        'pdf',
        'doc',
        'docx',
        'txt',
        'csv',
        'json',
        'xml',
        'log',
      ];

      if (
        !allowedTypes.includes(file.type) &&
        !allowedExtensions.includes(fileExtension || '')
      ) {
        setFileError(
          'Only PDF, Word documents, and text files are allowed (.pdf, .doc, .docx, .txt, .csv, .json, .xml, .log)'
        );
        setSelectedFile(null);
        event.target.value = ''; // Clear the input
        return;
      }

      // Check file size (limit to 10MB for documents)
      if (file.size > 10 * 1024 * 1024) {
        setFileError('File size must be less than 10MB');
        setSelectedFile(null);
        event.target.value = '';
        return;
      }

      setFileError('');
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
      setFileError('');
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setEmployee((prev) => ({ ...prev, [field]: value }));
    // When job changes, clear salary and error
    if (field === 'jobId') {
      setEmployee((prev) => ({ ...prev, salary: '' }));
      setSalaryError('');
    }

    // Validate email when it changes
    if (field === 'email') {
      setEmailError(validateEmail(value as string));
    }

    // Validate salary when it changes
    if (field === 'salary' && employee.jobId) {
      setSalaryError(validateSalary(value));
    }

    // Validate start date when it or hire date changes
    if (field === 'startDate') {
      setStartDateError(validateStartDate(value as string, employee.hireDate));
    }
    if (field === 'hireDate') {
      if (employee.startDate) {
        setStartDateError(
          validateStartDate(employee.startDate, value as string)
        );
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Final validation
    if (employee.email) {
      const error = validateEmail(employee.email);
      if (error) {
        setEmailError(error);
        return;
      }
    }

    if (employee.salary && employee.jobId) {
      const error = validateSalary(employee.salary);
      if (error) {
        setSalaryError(error);
        return;
      }
    }

    // Validate start date
    if (employee.startDate && employee.hireDate) {
      const error = validateStartDate(employee.startDate, employee.hireDate);
      if (error) {
        setStartDateError(error);
        return;
      }
    }

    const docs: EmployeeDocumentRequestFromEmployee = {} as any;

    if (selectedFile) {
      docs.documentContent = selectedFile;
      docs.documentName = selectedFile?.name ?? '';
    }

    const employeeData: any = {
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      hireDate: employee.hireDate,
      startDate: employee.startDate,
      salary: employee.salary ? Number(employee.salary) : 0,
      managerId: employee.managerId ? Number(employee.managerId) : '',
      jobId: employee.jobId ? Number(employee.jobId) : '',
      departmentId: employee.departmentId
        ? Number(employee.departmentId)
        : undefined,
      employeeDocuments: [docs],
    };

    if (employee.phoneNumber) {
      employeeData.phoneNumber = employee.phoneNumber;
    }

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
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      hireDate: '',
      startDate: '',
      salary: '',
      managerId: '',
      jobId: '',
      departmentId: '',
    });
    setSalaryError('');
    setStartDateError('');
    setEmailError('');
    setSelectedFile(null);
    setFileError('');
    closeModal();
  };

  // Helper text for salary field
  const getSalaryHelperText = () => {
    if (!employee.jobId) return 'Select a job title first';
    if (salaryError) return salaryError;
    const range = getSalaryRange();
    return range && range.min !== undefined && range.max !== undefined
      ? `Salary range: DKK ${range.min.toLocaleString()} - ${range.max.toLocaleString()}`
      : '';
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant='h5' component='h2' gutterBottom>
          {clickedUpdate ? 'Update Employee' : 'Create Employee'}
        </Typography>

        <Box component='form' onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Stack spacing={2}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
              }}
            >
              <TextField
                fullWidth
                label='First Name'
                value={employee.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                required
              />
              <TextField
                fullWidth
                label='Last Name'
                value={employee.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                required
              />
            </Box>

            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
              }}
            >
              <TextField
                fullWidth
                label='Email'
                type='email'
                value={employee.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                error={!!emailError}
                helperText={emailError || ''}
                required
              />
              <TextField
                fullWidth
                label='Phone Number'
                value={employee.phoneNumber}
                onChange={(e) =>
                  handleInputChange('phoneNumber', e.target.value)
                }
              />
            </Box>

            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
              }}
            >
              <TextField
                fullWidth
                label='Hire Date'
                type='date'
                value={employee.hireDate}
                onChange={(e) => handleInputChange('hireDate', e.target.value)}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                required
              />
              <TextField
                fullWidth
                label='Start Date'
                type='date'
                value={employee.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                error={!!startDateError}
                helperText={startDateError || "Employee's actual start date"}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />
            </Box>

            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
              }}
            >
              <TextField
                fullWidth
                label='Salary'
                type='number'
                value={employee.salary}
                onChange={(e) => handleInputChange('salary', e.target.value)}
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
                  label='Manager'
                  onChange={(e) =>
                    handleInputChange('managerId', e.target.value)
                  }
                >
                  <MenuItem value=''>
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
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
              }}
            >
              <FormControl fullWidth>
                <InputLabel>Job Title</InputLabel>
                <Select
                  value={employee.jobId}
                  label='Job Title'
                  onChange={(e) => handleInputChange('jobId', e.target.value)}
                >
                  <MenuItem value=''>
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
                  label='Department'
                  onChange={(e) =>
                    handleInputChange('departmentId', e.target.value)
                  }
                >
                  <MenuItem value=''>
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

            {/* File Upload Section */}
            <Box
              sx={{
                border: '1px dashed #ccc',
                borderRadius: 1,
                p: 2,
                textAlign: 'center',
                backgroundColor: '#fafafa',
              }}
            >
              <Typography variant='body2' color='textSecondary' gutterBottom>
                Upload Document (PDF, Word, or Text files)
              </Typography>
              <Button variant='outlined' component='label' sx={{ mb: 1 }}>
                Choose File
                <input
                  type='file'
                  hidden
                  accept='.pdf,.doc,.docx,.txt,.csv,.json,.xml,.log,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,text/csv,application/json,text/xml'
                  onChange={handleFileChange}
                />
              </Button>
              {selectedFile && (
                <Typography variant='body2' color='primary' sx={{ mt: 1 }}>
                  Selected: {selectedFile.name}
                </Typography>
              )}
              {fileError && (
                <Typography variant='body2' color='error' sx={{ mt: 1 }}>
                  {fileError}
                </Typography>
              )}
              {/* <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                Supported formats: .pdf, .doc, .docx, .txt, .csv, .json, .xml,
                .log (Max: 10MB)
              </Typography> */}
            </Box>
          </Stack>

          <Box
            sx={{
              mt: 3,
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'flex-end',
              gap: 2,
            }}
          >
            <Button
              onClick={handleClose}
              variant='outlined'
              sx={{
                width: { xs: '100%', sm: 'auto' },
              }}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              variant='contained'
              disabled={
                !!salaryError || !!startDateError || !!emailError || !!fileError
              }
              sx={{
                width: { xs: '100%', sm: 'auto' },
              }}
            >
              {clickedUpdate ? 'Update' : 'Create'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default EmployeeCreate;
