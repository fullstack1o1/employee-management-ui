import { Label } from "@mui/icons-material";
import { Box, Button, FormControl, Modal } from "@mui/material";
import { Input } from "@mui/material";
import { useAppDispatch } from "../store/hook";
import { createDepartment } from "../store/department.slice";
import { useState } from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
type DepartmentCreateProps = {
  open: boolean;
  closeModal: () => void;
};

const DepartmentCreate: React.FC<DepartmentCreateProps> = ({
  open,
  closeModal,
}) => {
  const dispatch = useAppDispatch();

  const [deptName, setDeptName] = useState("");

  const handleClick = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(createDepartment({ data: { departmentName: deptName } }));
    console.log(deptName);
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
        <Box sx={style}>
          <FormControl fullWidth>
            <Input
              placeholder="Department name"
              startAdornment={<Label />}
              inputProps={{ "aria-label": "Department name" }}
              onChange={(e) => setDeptName(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleClick}
              sx={{ mt: 2 }}
            >
              Create
            </Button>
          </FormControl>
        </Box>
      </Modal>
    </div>
  );
};

export default DepartmentCreate;
