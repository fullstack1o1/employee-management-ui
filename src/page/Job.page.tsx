import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hook";
import {
  // createJobTitle,
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

const Job = () => {
  const dispatch = useAppDispatch();
  const jobTitleListStatus = useAppSelector(
    (state) => state.jobSlice.jobTitles.status
  );
  const jobTitleList = useAppSelector((state) => state.jobSlice.jobTitles.data);

  const [open, setOpen] = useState(false);
  const [clickedUpdate, setClickedUpdate] = useState<{
    id: number;
    title: string;
    minSalary: number;
    maxSalary: number;
  } | null>(null);
  const [activeJobId, setActiveJobId] = useState<number | null>(null);
  const [activeAction, setActiveAction] = useState<"update" | "delete" | null>(
    null
  );
  const jobLoadingStatus = useAppSelector(
    (state) => state.jobSlice.jobTitles.status
  );

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setClickedUpdate(null);
    setActiveJobId(null);
    setActiveAction(null);
  };

  useEffect(() => {
    dispatch(fetchJobTitles());
  }, [dispatch]);

  const handleDeleteJob = (jobId: number) => {
    dispatch(deleteJobTitle({ id: jobId }));
    setActiveJobId(jobId);
    setActiveAction("delete");
  };

  const handleUpdateClick = (
    id: number,
    title: string,
    minSalary: number,
    maxSalary: number
  ) => {
    setActiveJobId(id);
    setActiveAction("update");
    setClickedUpdate({ id, title, minSalary, maxSalary });
    setOpen(true);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        mb={2}
        spacing={2}
      >
        {jobLoadingStatus !== APIStatus.PENDING && (
          <>
            <Typography
              variant="h5"
              component="div"
              sx={{
                textAlign: { xs: "center", sm: "left" },
                fontSize: { xs: "1.1rem", sm: "1.4rem" },
              }}
            >
              Job Titles
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpen}
              size="small"
              sx={{
                width: { xs: "100%", sm: "auto" },
                fontSize: { xs: "0.9rem", sm: "1rem" },
                py: { xs: 1, sm: 1.5 },
              }}
            >
              Create Job
            </Button>
          </>
        )}
      </Stack>

      <JobCreate
        open={open}
        closeModal={handleClose}
        clickedUpdate={clickedUpdate}
      />

      {jobTitleListStatus === APIStatus.PENDING && jobTitleList.length === 0 ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight={120}
        >
          <CircularProgress />
        </Box>
      ) : (
        <JobTitleList
          jobs={jobTitleList}
          onDelete={handleDeleteJob}
          onUpdate={handleUpdateClick}
          activeJobId={activeJobId}
          activeAction={activeAction}
        />
      )}
    </Box>
  );
};

export default Job;
