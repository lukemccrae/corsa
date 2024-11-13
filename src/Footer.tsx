import { Box } from "@mui/material"

export const Footer = () => {
    return (
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
        </Box>)
}