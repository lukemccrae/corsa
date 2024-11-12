import { Box, Container, Grid, Paper } from "@mui/material"
import { AddCourse } from "./AddCourse"
import Courses from "./Courses";
import React from "react";
import { Authenticate } from "./Authenticate";
import { useUser } from './context/UserContext';

export const App = () => {
    const [addCourseOpen, setAddCourseOpen] = React.useState(false);
    const [expandedPlan, setExpandedPlan] = React.useState<number | undefined>();

    const {checkValidTokenExp, isLoggedIn, login, logout, user} = useUser()

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
                    <Grid item xs={12} sm={6}>
                        <Paper
                            sx={{ p: 5, display: "flex", flexDirection: "column" }}
                        >
                            {addCourseOpen ? (
                                <AddCourse setAddCourseOpen={setAddCourseOpen} userId={user.userId}></AddCourse>
                            ) : (
                                <Courses expandedPlan={expandedPlan} setExpandedPlan={setExpandedPlan} userId={user.userId}></Courses>
                            )}
                        </Paper>
                    </Grid>
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