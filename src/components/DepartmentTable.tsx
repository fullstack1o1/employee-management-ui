import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Stack,
  Button,
  CircularProgress,
} from "@mui/material";
import type { DepartmentResponse } from "../myApi";

type DepartmentTableProps = {
  departments: DepartmentResponse[];
  onDelete: (id: number) => void;
  onUpdate: (id: number, name: string) => void;
  activeDepartmentId?: number | null;
  activeAction?: "update" | "delete" | null;
};

const DepartmentTable: React.FC<DepartmentTableProps> = ({
  departments,
  onDelete,
  onUpdate,
  activeDepartmentId,
  activeAction,
}) => {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table" className="deptlist-table">
        <TableHead>
          <TableRow>
            <TableCell align="inherit">Department ID</TableCell>
            <TableCell align="inherit">Department name</TableCell>
            <TableCell align="inherit">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {departments.map((dept) => {
            const isActive = dept.departmentId === activeDepartmentId;
            return (
              <TableRow
                key={dept.departmentId}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row" align="inherit">
                  {isActive && activeAction === "delete" ? (
                    <CircularProgress size={20} />
                  ) : (
                    dept.departmentId
                  )}
                </TableCell>
                <TableCell component="th" scope="row" align="inherit">
                  {isActive && activeAction === "update" ? (
                    <CircularProgress size={20} />
                  ) : (
                    dept.departmentName
                  )}
                </TableCell>
                <TableCell
                  component="th"
                  scope="row"
                  align="right"
                  sx={{ padding: "normal" }}
                >
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <Button
                      variant="contained"
                      color="error"
                      disabled={
                        activeDepartmentId === dept.departmentId &&
                        activeAction === "update"
                      }
                      onClick={() => {
                        if (dept.departmentId !== undefined)
                          onDelete(dept.departmentId);
                      }}
                    >
                      {activeDepartmentId === dept.departmentId &&
                      activeAction === "delete" ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        "Delete"
                      )}
                    </Button>

                    <Button
                      variant="contained"
                      color="success"
                      disabled={
                        activeDepartmentId === dept.departmentId &&
                        activeAction === "delete"
                      }
                      onClick={() => {
                        if (dept.departmentId !== undefined)
                          onUpdate(
                            dept.departmentId,
                            dept.departmentName ?? ""
                          );
                      }}
                    >
                      {activeDepartmentId === dept.departmentId &&
                      activeAction === "update" ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : (
                        "Update"
                      )}
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DepartmentTable;
