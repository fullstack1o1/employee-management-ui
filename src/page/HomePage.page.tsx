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
          <Typography
            variant="h3"
            align="center"
            gutterBottom
            color="primary"
            sx={{
              fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" }, // smaller on xs
              fontWeight: 600,
            }}
          >
            Employee Management
          </Typography>
          <Typography
            variant="h6"
            align="center"
            color="text.secondary"
            mb={4}
            sx={{
              fontSize: { xs: "1rem", sm: "1.25rem" }, // smaller on xs
              fontWeight: 400,
            }}
          >
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
              size={window.innerWidth < 600 ? "medium" : "large"}
              fullWidth={window.innerWidth < 600}
              startIcon={<PeopleIcon />}
              onClick={() => navigate("/employees")}
              disabled={true}
              sx={{
                fontSize: { xs: "1rem", sm: "1.1rem" },
              }}
            >
              Employees
            </Button>
            <Button
              variant="contained"
              color="secondary"
              size={window.innerWidth < 600 ? "medium" : "large"}
              fullWidth={window.innerWidth < 600}
              startIcon={<BusinessIcon />}
              onClick={() => navigate("/departments")}
              sx={{
                fontSize: { xs: "1rem", sm: "1.1rem" },
              }}
            >
              Departments
            </Button>
            <Button
              variant="contained"
              color="success"
              size={window.innerWidth < 600 ? "medium" : "large"}
              fullWidth={window.innerWidth < 600}
              startIcon={<WorkIcon />}
              onClick={() => navigate("/jobs")}
              sx={{
                fontSize: { xs: "1rem", sm: "1.1rem" },
              }}
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
