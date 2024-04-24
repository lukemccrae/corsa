import * as React from "react";
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


import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { mainListItems, secondaryListItems } from "./listItems";
import Chart from "./Chart";
import { Authenticate } from "./Authenticate";
import { AddCourse } from "./AddCourse";

import ProfileDropdown from "./ProfileDropdown";

import Courses from "./Courses";
import { Button, Menu, MenuItem } from "@mui/material";
import { AddButton } from "./AddButton";

function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://corsa.run">
        CORSA
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

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
  // Keeping this closed for now, dont feel like expanding it adds value
  // const [open, setOpen] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [user, setUser] = React.useState({ email: "", exp: 123, userId: "" });
  const [addCourseOpen, setAddCourseOpen] = React.useState(false);

  React.useEffect(() => {
    // Check local storage for login status on component mount
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
  }, []);

  const logout = () => {
    setUser({ email: "", exp: 123, userId: "" });
    setIsLoggedIn(false);
  };

  const checkValidTokenExp = (): Boolean => {
    return user.exp - Date.now() / 1000 > 0;
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="fixed">
            <Toolbar>
              <Typography
                component="h1"
                variant="h6"
                color="inherit"
                noWrap
                sx={{ flexGrow: 1 }}
              >
                CORSA
              </Typography>

              {isLoggedIn ? (
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
              ) : (
                <div></div>
              )}
            </Toolbar>
          </AppBar>
          {/* <Box sx={{ display: isLoggedIn ? "flex" : "none" }}>
            <List>
              {mainListItems({ setAddCourseOpen })}
              <Divider sx={{ my: 1 }} />
              {secondaryListItems}
            </List>
          </Box> */}
        </Box>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100%",
            overflow: "auto",
            width: '100vw',
            justifyContent: "center"
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {checkValidTokenExp() ? (
              <div>
                <Grid item xs={12} sm={6}>
                  <Paper
                    sx={{ p: 5, display: "flex", flexDirection: "column" }}
                  >
                    {addCourseOpen ? (
                      <AddCourse userId={user.userId}></AddCourse>
                    ) : (
                      <Courses userId={user.userId}></Courses>
                    )}
                  </Paper>
                </Grid>
              </div>
            ) : (
              <Authenticate
                isLoggedIn={isLoggedIn}
                setUser={setUser}
                setIsLoggedIn={setIsLoggedIn}
              ></Authenticate>
            )}
            {/* <Copyright sx={{ pt: 4 }} /> */}
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
