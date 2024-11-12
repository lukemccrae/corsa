import React, { createContext, useState, useContext, ReactNode } from 'react';
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MapIcon from "@mui/icons-material/Map";
import { MileProfile } from "./MileProfile";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';




import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { mainListItems, secondaryListItems } from "./listItems";
import Chart from "./Chart";
import { Authenticate } from "./Authenticate";
import { AddCourse } from "./AddCourse";


import ProfileDropdown from "./ProfileDropdown";

import Courses from "./Courses";
import { AddButton } from "./AddButton";
import { Articles } from './Articles';

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
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [user, setUser] = React.useState({ email: "", exp: 123, userId: "" });

  // Keeping this closed for now, dont feel like expanding it adds value
  // const [open, setOpen] = React.useState(false);
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

                {isLoggedIn && (
                <div style={{ display: "flex" }}>
                  <div
                    style={{
                      alignItems: "center",
                      display: "flex"
                    }}
                  >

                    {user.email}
                  </div>
                  {/* <MapIcon onClick={() => setAddCourseOpen(false)} /> */}
                  <ProfileDropdown logout={logout}></ProfileDropdown>
                  <AddButton addCourseOpen={addCourseOpen} setAddCourseOpen={setAddCourseOpen}></AddButton>
                </div>
                )}
              </Toolbar>
            </AppBar>
          </Box>


        {/* <Box sx={{ display: isLoggedIn ? "flex" : "none" }}>
            <List>
              {mainListItems({ setAddCourseOpen })}
              <Divider sx={{ my: 1 }} />
              {secondaryListItems}
            </List>
          </Box> */}

        
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
