import { Typography } from "@mui/material"
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import { Link } from "react-router-dom";

export const Logo = () => {
    return <Typography
    variant="h5"
    noWrap
    sx={{
      mr: 2,
      display: 'flex',
      flexGrow: 1,
      fontFamily: 'monospace',
      fontWeight: 700,
      letterSpacing: '.2rem',
      color: 'inherit',
      textDecoration: 'none',
      alignItems: 'center',
    }}
  >
    CORSA.
    <DirectionsRunIcon sx={{ ml: 1, margin: 0 }} />
  </Typography>
}