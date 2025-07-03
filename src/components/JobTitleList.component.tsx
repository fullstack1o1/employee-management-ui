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
  onUpdate: (
    id: number,
    title: string,
    minSalary: number,
    maxSalary: number
  ) => void;
  activeJobId?: number | null;
  activeAction?: "update" | "delete" | null;
}

const JobTitleList: React.FC<JobTitleListProps> = ({
  jobs,
  onDelete,
  onUpdate,
  activeJobId,
  activeAction,
}) => (
  <List>
    {jobs.map((job) => {
      const isActive = job.jobId === activeJobId;
      return (
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
              <IconButton
                edge="end"
                color="primary"
                size="small"
                disabled={isActive && activeAction === "delete"}
                onClick={() => {
                  if (job.jobId !== undefined)
                    onUpdate(
                      job.jobId,
                      job.title ?? "",
                      Number(job.minSalary),
                      Number(job.maxSalary)
                    );
                }}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                edge="end"
                color="error"
                size="small"
                disabled={isActive && activeAction === "update"}
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
      );
    })}
  </List>
);

export default JobTitleList;
