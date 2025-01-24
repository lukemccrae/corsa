import { Box, Container, Grid, Paper } from "@mui/material"

export const App = () => {

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
            </Container>
        </Box>
    )
}