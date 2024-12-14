import { Box, Container, Grid, Paper } from "@mui/material"
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
                // flexGrow: 1,
                // backgroundSize: "cover",
                // backgroundPosition: "center",
                // backgroundAttachment: "fixed", /* This keeps the background image fixed while scrolling */
                // backgroundRepeat: "no-repeat",
                height: "100vh",
                justifyContent: "center"
            }}
        >

            <Container maxWidth="lg" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: 0, marginTop: '64px' }}>
                {checkValidTokenExp() && user ? (
                    <Paper sx={{ p: 5, display: "flex", flexDirection: "column" }}>
                        <UI></UI>
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