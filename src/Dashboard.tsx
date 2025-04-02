import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from './context/UserContext';
import { ListItemText } from '@mui/material';
import Divider from '@mui/material/Divider';
import AddIcon from "@mui/icons-material/Add";

export const Dashboard = () => {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const { user, logoutUser } = useUser();
  const navigate = useNavigate();

  const location = useLocation();

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // Sketchy menu system matching name to method to execute
  // Switch to onClick?  
  type Setting = "Logout" | "Add Course" | "App";
  const settings: Setting[] = ["Logout", "Add Course", "App"];

  // // Map each setting to its corresponding function
  const settingActions: Record<Setting, () => void> = {
    Logout: () => logoutUser(),
    "Add Course": () => navigate("/add-course"),
    "App": () => navigate("/app"),    
  };

  return (
    <AppBar sx={{ backgroundColor: "#515B63" }} position="fixed">
      <Container maxWidth="md">
        <Toolbar disableGutters>
          <Typography
            variant="h5"
            noWrap
            component={Link}
            to="/"
            sx={{
              display: {md: 'flex' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.2rem',
              color: 'inherit',
              textDecoration: 'none',
              alignItems: 'center',
              '&:hover': {
                color: '#E3A446',
              },
            }}
          >
            CORSA.
            <DirectionsRunIcon sx={{ ml: 1, margin: 0 }} />
          </Typography>
          {(user) && (
            <div style={{ display: "flex" }}>
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Account settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt={user.preferred_username.toUpperCase()} src={user.picture} />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting: string) => (
                    <MenuItem key={setting} onClick={() => {
                      handleCloseUserMenu();
                      settingActions[setting as Setting]();
                    }}>
                      <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                    </MenuItem>
                  ))}
                  <Divider></Divider>
                  <ListItemText primary={user.email} sx={{ textAlign: 'center', color: 'gray', padding: "2px" }} />

                </Menu>
              </Box>
            </div>
          )} 

        </Toolbar>
      </Container>
    </AppBar>
  );
}

