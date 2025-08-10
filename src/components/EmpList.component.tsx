import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  IconButton,
  Stack,
  Avatar,
  ListItemAvatar,
} from "@mui/material";
import { Visibility, Person, Delete } from "@mui/icons-material";
import type { EmployeeResponse } from "../myApi";
import { useNavigate } from "react-router-dom";
import "./EmpList.css";

interface EmpListProps {
  empList: EmployeeResponse[];
}

const EmpList: React.FC<EmpListProps> = ({ empList }) => {
  const navigate = useNavigate();

  const handleViewMore = (employeeId: number) => {
    navigate(`/employee/${employeeId}`);
  };

  return (
    <Box className="emp-list-container">
      <List>
        {empList.map((emp) => (
          <ListItem
            key={emp.employeeId}
            className="emp-list-item"
            secondaryAction={
              <Stack
                direction="row"
                spacing={1}
                className="emp-list-secondary-action"
              >
                <IconButton
                  onClick={() =>
                    emp.employeeId && handleViewMore(emp.employeeId)
                  }
                  aria-label="view more details"
                  size="small"
                  className="emp-list-icon-button"
                >
                  <Visibility />
                </IconButton>
                <IconButton
                  aria-label="delete employee"
                  size="small"
                  color="error"
                  className="emp-list-icon-button"
                >
                  <Delete />
                </IconButton>
              </Stack>
            }
          >
            <Box className="emp-list-content-box">
              <ListItemAvatar className="emp-list-avatar">
                <Avatar>
                  <Person />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                className="emp-list-text"
                primary={
                  <Typography variant="subtitle1" fontWeight="medium">
                    {emp.firstName} {emp.lastName}
                  </Typography>
                }
                secondary={
                  <Box className="emp-list-secondary-text">
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      className="emp-list-info-text"
                    >
                      ID: {emp.employeeId}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      className="emp-list-info-text"
                    >
                      Email: {emp.email}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      className="emp-list-info-text"
                    >
                      Phone: {emp.phoneNumber}
                    </Typography>
                  </Box>
                }
              />
            </Box>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default EmpList;
