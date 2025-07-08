import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";

import MenuIcon from "@mui/icons-material/Menu";
import { navItems } from "./navItems";

const NavBar = ({
  onMenuClick,
  isActive,
}: {
  onMenuClick: () => void;
  isActive: (path: string) => boolean;
}) => {
  return (
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
            onClick={onMenuClick}
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
  );
};

export default NavBar;
