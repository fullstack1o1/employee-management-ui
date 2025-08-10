import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
} from "@mui/material";
import { useAppDispatch } from "../store/hook";
import { createJobTitle, updateJobTitle } from "../store/job.slice";

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 350,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

type JobCreateModalProps = {
  open: boolean;
  closeModal: () => void;
  clickedUpdate: {
    id: number;
    title: string;
    minSalary: number;
    maxSalary: number;
  } | null;
};

const JobCreate: React.FC<JobCreateModalProps> = ({
  open,
  closeModal,
  clickedUpdate,
}) => {
  const [job, setJob] = useState<{
    title: string;
    minSalary: number | "";
    maxSalary: number | "";
  }>({
    title: "",
    minSalary: "",
    maxSalary: "",
  });

  const [errors, setErrors] = useState<{ title: string; minSalary: string }>({
    title: "",
    minSalary: "",
  });
  const dispatch = useAppDispatch();

  useEffect(() => {
    setJob({
      title: clickedUpdate?.title || "",
      minSalary: clickedUpdate?.minSalary || "",
      maxSalary: clickedUpdate?.maxSalary || "",
    });
  }, [clickedUpdate, open]);

  useEffect(() => {
    if (
      job.minSalary !== "" &&
      job.maxSalary !== "" &&
      Number(job.minSalary) >= 0 &&
      Number(job.minSalary) <= Number(job.maxSalary)
    ) {
      setErrors((prev) => ({ ...prev, minSalary: "" }));
    }
  }, [job]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (job.title.trim() === "") {
      setErrors((prev) => ({ ...prev, title: "Job title is required" }));
      return;
    }
    if (Number(job.minSalary) < 0) {
      setErrors((prev) => ({
        ...prev,
        minSalary: "salary cannot be negative",
      }));
      return;
    }
    if (Number(job.minSalary) > Number(job.maxSalary)) {
      setErrors((prev) => ({
        ...prev,
        minSalary: "minimum salary can't be grater than maximum salary",
      }));
      return;
    }

    if (clickedUpdate) {
      dispatch(
        updateJobTitle({
          id: clickedUpdate.id,
          data: {
            title: job.title,
            minSalary: Number(job.minSalary),
            maxSalary: Number(job.maxSalary),
          },
        })
      );
    } else {
      dispatch(
        createJobTitle({
          data: {
            title: job.title,
            minSalary: Number(job.minSalary),
            maxSalary: Number(job.maxSalary),
          },
        })
      );
    }

    setJob({ title: "", minSalary: "", maxSalary: "" });
    closeModal();
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJob((prev) => ({ ...prev, title: e.target.value }));
    if (e.target.value.trim() !== "") setErrors({ title: "", minSalary: "" });
  };
  const handleMinSalary = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJob((prev) => ({
      ...prev,
      minSalary: e.target.value === "" ? "" : Number(e.target.value),
    }));
  };
  const handleMaxSalary = (e: React.ChangeEvent<HTMLInputElement>) => {
    setJob((prev) => ({
      ...prev,
      maxSalary: e.target.value === "" ? "" : Number(e.target.value),
    }));
  };

  return (
    <Modal open={open} onClose={closeModal}>
      <Box sx={style} component="form" onSubmit={handleSubmit}>
        <Typography variant="h6" mb={2}>
          {clickedUpdate ? "Update Job" : "Create Job"}
        </Typography>
        <TextField
          label="Job Title"
          fullWidth
          margin="normal"
          value={job.title}
          onChange={handleTitleChange}
          required
          error={!!errors.title.length}
          helperText={errors.title}
        />
        <TextField
          label="Min Salary"
          type="number"
          fullWidth
          margin="normal"
          value={job.minSalary}
          error={!!errors.minSalary.length}
          helperText={errors.minSalary}
          onChange={handleMinSalary}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">Dkk</InputAdornment>
              ),
            },
          }}
          required
        />
        <TextField
          label="Max Salary"
          type="number"
          fullWidth
          margin="normal"
          value={job.maxSalary}
          onChange={handleMaxSalary}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">Dkk</InputAdornment>
              ),
            },
          }}
          required
        />
        <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
          <Button
            type="submit"
            variant="contained"
            disabled={
              job.title === "" || job.minSalary === "" || job.maxSalary === ""
            }
          >
            {clickedUpdate ? "Update Job" : "Create Job"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default JobCreate;
