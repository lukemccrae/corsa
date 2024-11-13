import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import ProfileDropdown from "./ProfileDropdown";

import { AddButton } from "./AddButton";
import { useUser } from './context/UserContext';

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  })
}));

const defaultTheme = createTheme();

export default function Dashboard() {
  const { isLoggedIn, logout, user } = useUser()
  console.log("hi from app bar", user)
  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
          <Box sx={{ flexGrow: 1 }}>
            <AppBar position="fixed">
              <Toolbar>
                <Box sx={{display: 'flex', alignItems: 'center'}}>
                <Typography
                  component="h1"
                  variant="h6"
                  color="inherit"
                  noWrap
                  sx={{ flexGrow: 1 }}
                >
                  CORSA
                </Typography>
                <Link style={{ color: 'white' }} to="/app">app</Link>
                <Link style={{ color: 'white' }} to="/articles">articles</Link>
                </Box>
                {(isLoggedIn && user) && (
                <div style={{ display: "flex" }}>
                  <div
                    style={{
                      alignItems: "center",
                      display: "flex"
                    }}
                  >
                    {user.email}
                  </div>
                  <ProfileDropdown logout={logout}></ProfileDropdown>
                  <AddButton></AddButton>
                </div>
                )}
              </Toolbar>
            </AppBar>
          </Box>
        <Box
          component="footer"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          width="100%"
          height="30px"
          bgcolor="grey.200"
          p={1}
          position="fixed"
          bottom="0"
        >
          <div>{"site by "}<a href="https://www.linkedin.com/in/lukemccrae/"> Luke McCrae</a></div>
          <div>
            <a href="https://github.com/lukemccrae/corsa">Copyleft</a> CORSA {new Date().getFullYear()}
          </div>
        </Box>
      </Box>

    </ThemeProvider>
  );
}
