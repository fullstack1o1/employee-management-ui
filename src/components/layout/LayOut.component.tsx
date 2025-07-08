import { useState } from "react";
import NavBar from "./NavBar.component";
import NavDrawer from "./NavDrawer.component";
import { Outlet, useLocation } from "react-router-dom";
import "./layout.css";
import { Box } from "@mui/material";

const Layout = () => {
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <Box className="layout-container">
      <NavBar onMenuClick={() => setDrawerOpen(true)} isActive={isActive} />
      <NavDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        isActive={isActive}
      />
      <Box className="main-content">
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
