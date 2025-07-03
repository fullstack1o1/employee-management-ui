import { Box, Button, Modal, TextField } from "@mui/material";
import { useAppDispatch } from "../store/hook";
import { createDepartment, updateDepartment } from "../store/department.slice";
import { useEffect, useState } from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #ffffff",
  borderRadius: "8px",
  outline: "none",
  boxShadow: 24,
  p: 4,
};
type DepartmentCreateProps = {
  open: boolean;
  closeModal: () => void;
  clickedUpdate?: { id: number; name: string } | null;
};

const DepartmentCreate: React.FC<DepartmentCreateProps> = ({
  open,
  closeModal,
  clickedUpdate,
}) => {
  const dispatch = useAppDispatch();
  const [deptName, setDeptName] = useState("");

  useEffect(() => {
    setDeptName(clickedUpdate?.name || "");
  }, [clickedUpdate, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (clickedUpdate) {
      dispatch(
        updateDepartment({
          id: clickedUpdate.id,
          data: { departmentName: deptName },
        })
      );
    } else {
      dispatch(createDepartment({ data: { departmentName: deptName } }));
    }
    setDeptName("");
    closeModal();
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={closeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            placeholder="Department name"
            onChange={(e) => setDeptName(e.target.value)}
            value={deptName}
          />

          <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={!deptName}
            >
              {clickedUpdate ? "Update Departmnt" : "Create Department"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default DepartmentCreate;
