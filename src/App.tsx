import { Box, Container, Grid, Paper } from "@mui/material"
import Courses from "./Courses";
import React from "react";
import { Authenticate } from "./Authenticate";
import { useUser } from './context/UserContext';
import { UI } from "./UI";

export const App = () => {
    const { checkValidTokenExp, isLoggedIn, login, logout, user } = useUser()

    return (
        <Box
            component="main"
            sx={{
                // backgroundImage: `url('../splash.min.jpg');`,
                flexGrow: 1,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundAttachment: "fixed", /* This keeps the background image fixed while scrolling */
                backgroundRepeat: "no-repeat",
                height: "100vh",
                overflow: "auto",
                width: '100vw',
                justifyContent: "center"
            }}
        >

            <Container maxWidth="lg" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {checkValidTokenExp() && user ? (
                    <Paper sx={{ p: 5, display: "flex", flexDirection: "column", marginTop: '96px', overflow: 'auto' }}>
                        <UI></UI>
                        {/* <Courses expandedPlan={expandedPlan} setExpandedPlan={setExpandedPlan} userId={user.userId}></Courses> */}
                    </Paper>
                ) : (
                    <Authenticate
                        isLoggedIn={isLoggedIn}
                        login={login}
                        logout={logout}
                    ></Authenticate>
                )}
            </Container>
        </Box>
    )
}