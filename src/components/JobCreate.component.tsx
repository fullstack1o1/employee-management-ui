import React, { useState } from "react";
import { Modal, Box, TextField, Button, Typography } from "@mui/material";

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

interface JobCreateModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (job: {
    title: string;
    minSalary: number;
    maxSalary: number;
  }) => void;
}

const JobCreate: React.FC<JobCreateModalProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState("");
  const [minSalary, setMinSalary] = useState<number | "">("");
  const [maxSalary, setMaxSalary] = useState<number | "">("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || minSalary === "" || maxSalary === "") return;
    onSubmit({
      title,
      minSalary: Number(minSalary),
      maxSalary: Number(maxSalary),
    });
    setTitle("");
    setMinSalary("");
    setMaxSalary("");
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style} component="form" onSubmit={handleSubmit}>
        <Typography variant="h6" mb={2}>
          Create Job
        </Typography>
        <TextField
          label="Job Title"
          fullWidth
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <TextField
          label="Min Salary"
          type="number"
          fullWidth
          margin="normal"
          value={minSalary}
          onChange={(e) =>
            setMinSalary(e.target.value === "" ? "" : Number(e.target.value))
          }
          required
        />
        <TextField
          label="Max Salary"
          type="number"
          fullWidth
          margin="normal"
          value={maxSalary}
          onChange={(e) =>
            setMaxSalary(e.target.value === "" ? "" : Number(e.target.value))
          }
          required
        />
        <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
          <Button
            type="submit"
            variant="contained"
            disabled={!title || minSalary === "" || maxSalary === ""}
          >
            Create Job title
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default JobCreate;
