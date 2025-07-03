import React, { useEffect, useState } from "react";
import { Modal, Box, TextField, Button, Typography } from "@mui/material";
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
  const [title, setTitle] = useState("");
  const [minSalary, setMinSalary] = useState<number | "">("");
  const [maxSalary, setMaxSalary] = useState<number | "">("");
  const dispatch = useAppDispatch();

  useEffect(() => {
    setTitle(clickedUpdate?.title || "");
    setMinSalary(clickedUpdate?.minSalary || "");
    setMaxSalary(clickedUpdate?.maxSalary || "");
  }, [clickedUpdate, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (clickedUpdate) {
      dispatch(
        updateJobTitle({
          id: clickedUpdate.id,
          data: {
            title: title,
            minSalary: Number(minSalary),
            maxSalary: Number(maxSalary),
          },
        })
      );
      console.log(clickedUpdate.id, title, minSalary, maxSalary);
    } else {
      dispatch(
        createJobTitle({
          data: {
            title: title,
            minSalary: Number(minSalary),
            maxSalary: Number(maxSalary),
          },
        })
      );
    }

    setTitle("");
    setMinSalary("");
    setMaxSalary("");
    closeModal();
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
            disabled={title === "" || minSalary === "" || maxSalary === ""}
          >
            {clickedUpdate ? "Update Job" : "Create Job"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default JobCreate;
