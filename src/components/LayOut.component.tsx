import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import { Link, Outlet, useLocation } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import BusinessIcon from "@mui/icons-material/Business";
import WorkIcon from "@mui/icons-material/Work";
import "./layout.css";

const Layout = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { text: "Home", icon: <HomeIcon />, path: "/" },
    { text: "Departments", icon: <BusinessIcon />, path: "/departments" },
    { text: "Jobs", icon: <WorkIcon />, path: "/jobs" },
  ];

  return (
    <Box className="layout-container">
      <AppBar position="sticky" className="appbar">
        <Toolbar>
          <Typography
            className="nav-typo"
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, color: "#ffffff" }}
          >
            Emp Management
          </Typography>
          {navItems.map((item) => (
            <Button
              key={item.text}
              component={Link}
              to={item.path}
              className={`nav-button ${
                isActive(item.path) ? "active-button" : ""
              }`}
              startIcon={item.icon}
              sx={{ mx: 1 }}
            >
              {item.text}
            </Button>
          ))}
        </Toolbar>
      </AppBar>

      <Box className="main-content">
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
