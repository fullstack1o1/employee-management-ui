import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import type { JobTitleResponse } from "../myApi";

interface JobTitleListProps {
  jobs: JobTitleResponse[];
  onDelete: (jobId: number) => void;
}

const JobTitleList: React.FC<JobTitleListProps> = ({ jobs, onDelete }) => (
  <List>
    {jobs.map((job) => (
      <ListItem
        key={job.jobId}
        sx={{
          borderRadius: 1,
          mb: 1,
          bgcolor: "grey.50",
          boxShadow: 1,
        }}
        secondaryAction={
          <Stack direction="row" spacing={1}>
            <IconButton edge="end" color="primary" size="small">
              <EditIcon />
            </IconButton>
            <IconButton
              edge="end"
              color="error"
              size="small"
              onClick={() => {
                if (job.jobId !== undefined) onDelete(job.jobId);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Stack>
        }
      >
        <ListItemText
          primary={
            <Typography variant="subtitle1" fontWeight={500}>
              {job.title}
            </Typography>
          }
          secondary={
            <Typography variant="body2" color="text.secondary">
              Min Salary: {job.minSalary ?? "-"} | Max Salary:{" "}
              {job.maxSalary ?? "-"}
            </Typography>
          }
        />
      </ListItem>
    ))}
  </List>
);

export default JobTitleList;
