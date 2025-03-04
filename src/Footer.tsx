import { Box, Link } from "@mui/material";

export const Footer = () => {
    return (
        <Box
            component="footer"
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="100%"
            height="10px" // Increased height for better visibility
            bgcolor="grey.200"
            p={1}
            position="sticky"
            bottom="0"
        >
            <div
                style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    textAlign: "start",
                }}
            >
                <span
                    style={{
                        backgroundImage: "linear-gradient(90deg, #d83232, #e28524, #d1a500, #2d832f, #0077b5, #4b2ca2, #ad4a8f)",
                        backgroundSize: "600% 100%", // Increased background size for better animation
                        WebkitBackgroundClip: "text",
                        color: "transparent",
                        animation: "rainbow-text 5s linear infinite", // Apply animation to the span
                    }}
                >
                    <Link
                        href="https://docs.google.com/forms/d/e/1FAIpQLSeC3yoPVanzaJmeqYOXzIlaYuQnSyezupV5BO4NfEMMBLlCXw/viewform"
                        underline="hover"
                        style={{ color: "transparent", textDecoration: "none" }} // Make the link color transparent so it inherits animation
                    >
                        Corsa is looking for writers. Click to subscribe to the newsletter or create!
                    </Link>
                </span>
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
};
