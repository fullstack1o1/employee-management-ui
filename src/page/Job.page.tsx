import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hook";
import {
  createJobTitle,
  deleteJobTitle,
  fetchJobTitles,
} from "../store/job.slice";
import { APIStatus } from "../store/department.slice";
import {
  Button,
  Stack,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import JobCreate from "../components/JobCreate.component";
import JobTitleList from "../components/JobTitleList.component";

const JobList = () => {
  const dispatch = useAppDispatch();
  const jobTitleListStatus = useAppSelector(
    (state) => state.jobSlice.jobTitles.status
  );
  const jobTitleList = useAppSelector((state) => state.jobSlice.jobTitles.data);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchJobTitles());
  }, [dispatch]);

  const handleDeleteJob = (jobId: number) => {
    dispatch(deleteJobTitle({ id: jobId }));
  };

  const handleCreateJob = (job: {
    title: string;
    minSalary: number;
    maxSalary: number;
  }) => {
    dispatch(createJobTitle({ data: job }));
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5" component="div">
          Job Titles
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
          disabled={jobTitleListStatus === APIStatus.PENDING}
        >
          Create Job
        </Button>
      </Stack>
      {jobTitleListStatus === APIStatus.PENDING ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight={120}
        >
          <CircularProgress />
        </Box>
      ) : jobTitleList.length > 0 ? (
        <JobTitleList jobs={jobTitleList} onDelete={handleDeleteJob} />
      ) : (
        <Typography variant="body2" color="text.secondary">
          No job titles available.
        </Typography>
      )}

      <JobCreate
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleCreateJob}
      />
    </Box>
  );
};

export default JobList;
