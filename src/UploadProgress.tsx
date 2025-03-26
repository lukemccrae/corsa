import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

interface UploadProgressProps {
    progress: number;
}

export default function UploadProgress(props: UploadProgressProps) {

    return (
        <Box sx={{ margin: "10px 10px 0 10px", width: '100%', display: props.progress !== 0 ? "block" : "none" }}>
            <LinearProgress variant="determinate" value={props.progress} />
        </Box>
    );
}