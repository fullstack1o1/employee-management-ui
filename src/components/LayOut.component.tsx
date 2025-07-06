import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Link, Outlet, useLocation } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import BusinessIcon from "@mui/icons-material/Business";
import WorkIcon from "@mui/icons-material/Work";
import MenuIcon from "@mui/icons-material/Menu";
import "./layout.css";
import { useState } from "react";

const Layout = () => {
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

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
          {/*burger menu for small screen */}
          <Box sx={{ display: { xs: "block", sm: "none" } }}>
            <IconButton
              color="inherit"
              edge="end"
              onClick={() => setDrawerOpen(true)}
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
          </Box>
          {/* Buttons for large screens */}
          <Box sx={{ display: { xs: "none", sm: "flex" } }}>
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
          </Box>
        </Toolbar>
      </AppBar>
      {/* Drawer for small screens */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{ display: { xs: "block", sm: "none" } }}
      >
        <Box
          sx={{ width: 220 }}
          role="presentation"
          onClick={() => setDrawerOpen(false)}
          onKeyDown={() => setDrawerOpen(false)}
        >
          <List>
            {navItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  selected={isActive(item.path)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <Box className="main-content">
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
