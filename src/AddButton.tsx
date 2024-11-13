import AddIcon from "@mui/icons-material/Add";
import { IconButton } from "@mui/material";
import Button from "@mui/material/Button";
import { Link, useLocation } from 'react-router-dom';


export const AddButton = () => {
    const location = useLocation();
    const buttonClicked = location.pathname === '/add-course';

    return (
        <IconButton
        component={Link}
        to={buttonClicked ? "/app" : "/add-course"}
        size="small"
        sx={{
          minWidth: 'unset',
          backgroundColor: buttonClicked ? 'white' : 'transparent',
          width: 'fit-content',
          borderRadius: '50%', // Circular button
          border: '1px solid #ccc',
          color: buttonClicked ? 'blue' : 'white',
          '&:hover': {
            backgroundColor: 'white',
          },
        }}
      >
        <AddIcon fontSize="small" />
      </IconButton>
    )
}