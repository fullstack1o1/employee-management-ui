import {
  Stack,
  CircularProgress,
  ListItem,
  ListItemText,
  List,
  Typography,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import type { DepartmentResponse } from "../myApi";

type DepartmentListProps = {
  departments: DepartmentResponse[];
  onDelete: (id: number) => void;
  onUpdate: (id: number, name: string) => void;
  activeDepartmentId?: number | null;
  activeAction?: "update" | "delete" | null;
};

const DepartmentList: React.FC<DepartmentListProps> = ({
  departments,
  onDelete,
  onUpdate,
  activeDepartmentId,
  activeAction,
}) => {
  return (
    <List>
      {departments.map((dept) => {
        const isActive = dept.departmentId === activeDepartmentId;
        return (
          <ListItem
            key={dept.departmentId}
            sx={{
              borderRadius: 1,
              mb: 1,
              bgcolor: "grey.50",
              boxShadow: 1,
            }}
            secondaryAction={
              <Stack
                direction={{ xs: "row", sm: "row" }}
                spacing={1}
                sx={{
                  width: { xs: "100%", sm: "auto" },
                  justifyContent: { xs: "flex-end", sm: "flex-end" },
                  mt: { xs: 1, sm: 0 },
                }}
              >
                <IconButton
                  edge="end"
                  color="primary"
                  size="small"
                  disabled={isActive && activeAction === "delete"}
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    minHeight: 44,
                  }}
                  onClick={() => {
                    if (dept.departmentId !== undefined)
                      onUpdate(dept.departmentId, dept.departmentName ?? "");
                  }}
                >
                  {isActive && activeAction === "update" ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <EditIcon />
                  )}
                </IconButton>
                <IconButton
                  edge="end"
                  color="error"
                  size="small"
                  disabled={isActive && activeAction === "update"}
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    minHeight: 44,
                  }}
                  onClick={() => {
                    if (dept.departmentId !== undefined)
                      onDelete(dept.departmentId);
                  }}
                >
                  {isActive && activeAction === "delete" ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <DeleteIcon />
                  )}
                </IconButton>
              </Stack>
            }
          >
            <ListItemText
              primary={
                <Typography variant="body1">
                  {isActive && activeAction === "update" ? (
                    <CircularProgress size={20} />
                  ) : (
                    dept.departmentName
                  )}
                </Typography>
              }
            />
          </ListItem>
        );
      })}
    </List>
  );
};

export default DepartmentList;
