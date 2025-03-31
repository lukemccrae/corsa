import { Typography } from "@mui/material"
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import { Link } from "react-router-dom";

export const Logo = () => {
    return <Typography
    noWrap
    sx={{
      mr: 2,
      display: 'flex',
      flexGrow: 1,
      fontFamily: 'monospace',
      fontWeight: 700,
      letterSpacing: '.2rem',
      color: 'black',
      textDecoration: 'none',
      alignItems: 'center',
      justifyContent: "flex-end",
    }}
  >
    CORSA.
    <DirectionsRunIcon sx={{ ml: 1, margin: 0 }} />
    {/* <DirectionsBikeIcon sx={{ ml: 1, margin: 0 }} /> */}

  </Typography>
}