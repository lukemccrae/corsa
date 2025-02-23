import { Box } from "@mui/material";

export const Footer = () => {
    return (
        <Box
            component="footer"
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="100%"
            height="10px"
            bgcolor="grey.200"
            p={1}
            position="fixed"
            bottom="0"
        >
            <div style={{
                fontSize: "12px",
                fontWeight: "bold",
                textAlign: "start",
                backgroundImage: "linear-gradient(90deg, #d83232, #e28524, #d1a500, #2d832f, #0077b5, #4b2ca2, #ad4a8f)",
                backgroundSize: "300% 100%",
                WebkitBackgroundClip: "text",
                color: "transparent",
                animation: "rainbow-text 5s linear infinite",
            }}>
                Corsa is looking for writers! email lukemccrae@gmail.com
            </div>
            <style>
                {`
                    @keyframes rainbow-text {
                        0% { background-position: 100% 0; }
                        100% { background-position: 0 0; }
                    }
                `}
            </style>
        </Box>
    );
}
