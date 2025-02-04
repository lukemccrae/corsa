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
import { Link, useLocation } from 'react-router-dom';
import { useUser } from './context/UserContext';
import { AddButton } from "./AddButton";
import { ListItemText } from '@mui/material';
import Divider from '@mui/material/Divider';
import AddIcon from "@mui/icons-material/Add";


// const pages = ['App'];

export const Dashboard = () => {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const { user, logoutUser } = useUser()

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
  type Setting = "Logout";
  const settings: Setting[] = ["Logout"];

  // // Map each setting to its corresponding function
  const settingActions: Record<Setting, () => void> = {
    Logout: () => logoutUser(),
  };

  return (
    <AppBar sx={{ backgroundColor: "#515B63" }} position="fixed">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h5"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
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

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            {/* <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {pages.map((page) => (

                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Link style={{
                    color: 'black',
                  }} to={page.toLowerCase()}>{page}</Link>

                </MenuItem>
              ))}
            </Menu> */}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", mr: 1 }}>
            <Typography
              variant="h5"
              noWrap
              component={Link}
              to="/"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.2rem',
                color: 'inherit',
                textDecoration: 'none',
                alignItems: 'center', // Center-align text and icon
                '&:hover': {
                  color: '#E3A446',
                },
              }}
            >
              <Typography>CORSA.</Typography>
              <DirectionsRunIcon sx={{ ml: 1, margin: 0 }} />
            </Typography>
          </Box>

          {/* <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: "end" }}>
            {pages.map((page) => {

              return (
                <Link key={page} style={{ 
                  color: 'white', 
                  margin: "5px", 
                }} 
                  to={page.toLowerCase()}

                >
                  {page}
                </Link>
              )
            })}
          </Box> */}
          {(user) && (
            <div style={{ display: "flex" }}>
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Account settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt={user.preferred_username.toUpperCase()} src="/static/images/avatar/2.jpg" />
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
              <Box sx={{}}>
                <Tooltip title="Add Course">
                  <IconButton
                    component={Link}
                    to={"/add-course"}
                    size="small"
                    sx={{
                      borderRadius: '50%', // Circular button
                      border: '1px solid #ccc',
                      backgroundColor: '#469CE3'
                    }}
                  >
                    <AddIcon></AddIcon>
                  </IconButton>
                </Tooltip>
              </Box>

              {/* <AddButton location={location.pathname}></AddButton> */}
            </div>
          )}

        </Toolbar>
      </Container>
    </AppBar>
  );
}

