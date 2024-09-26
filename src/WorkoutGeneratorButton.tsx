import { IconButton } from "@mui/material";
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import React from "react";
interface WorkoutGeneratorProps {
    setGeneratorOpen: Function
    generatorOpen: Boolean
}




export const WorkoutGeneratorButton = (props: WorkoutGeneratorProps) => {

    const toggleGeneratorWindow = () => {
        props.setGeneratorOpen(!props.generatorOpen)

    }
    return (
        <div>
            <IconButton
                onClick={(event) => event.stopPropagation()}
                aria-label="magic"
                size="small"
                sx={{
                    border: '1px solid #ccc',
                    '&:hover': {
                        backgroundColor: 'white', // Change the background color on hover
                    },
                }}>
                <AutoFixHighIcon onClick={() => toggleGeneratorWindow()} fontSize="inherit" />
            </IconButton>
        </div>
    )
}

