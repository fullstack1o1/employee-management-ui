import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import BusinessIcon from "@mui/icons-material/Business";
import WorkIcon from "@mui/icons-material/Work";
import PeopleIcon from "@mui/icons-material/People";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        p: 2,
      }}
    >
      <Card sx={{ maxWidth: 500, width: "100%", boxShadow: 4 }}>
        <CardContent>
          <Typography variant="h3" align="center" gutterBottom color="primary">
            Employee Management
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" mb={4}>
            Welcome! Manage your employees, departments, and jobs efficiently.
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
          >
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<PeopleIcon />}
              onClick={() => navigate("/employees")}
              disabled={true}
            >
              Employees
            </Button>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              startIcon={<BusinessIcon />}
              onClick={() => navigate("/departments")}
            >
              Departments
            </Button>
            <Button
              variant="contained"
              color="success"
              size="large"
              startIcon={<WorkIcon />}
              onClick={() => navigate("/jobs")}
            >
              Jobs
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default HomePage;
