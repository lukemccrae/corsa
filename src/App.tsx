import { Box, Container, Grid, Paper } from "@mui/material"
import { useUser } from "./context/UserContext"
import { Authenticate } from "./Authenticate";
import { UI } from "./UI";
import React from "react";

export const App = () => {
    const { user } = useUser();
    return (
        <Box
            component="main"
            sx={{
                height: "100vh",
                justifyContent: "center"
            }}
        >
            <Container
                maxWidth="lg"
                style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    padding: 0,
                    marginTop: '64px'
                }}>
                {user ? (
                    <UI></UI>
                ) : (<Authenticate></Authenticate>)}
            </Container>
        </Box>
    )
}