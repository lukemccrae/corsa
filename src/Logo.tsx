import { Typography } from '@mui/material';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';

interface LogoProps {
  activityType: string;
  color: string;
}

export const Logo = (props: LogoProps) => {
  return (
    <Typography
      noWrap
      sx={{
        mr: 3,
        display: 'flex',
        flexGrow: 1,
        fontFamily: 'monospace',
        fontWeight: 700,
        letterSpacing: '.3rem',
        color: props.color,
        textDecoration: 'none',
        alignItems: 'center',
        justifyContent: 'flex-end',
        fontSize: 16,
      }}
    >
      CORSA.
      {props.activityType === 'RUN' ? (
        <DirectionsRunIcon sx={{ ml: 1, margin: '0 0 2px 0', fontSize: 20 }} />
      ) : (
        <DirectionsBikeIcon sx={{ ml: 1, margin: '0 0 2px 0', fontSize: 25 }} />
      )}
    </Typography>
  );
};
