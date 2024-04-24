import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";


interface AddButtonProps {
    setAddCourseOpen: Function;
    addCourseOpen: Boolean;
}

export const AddButton = (props: AddButtonProps) => {
    return (
        <Button
            id="basic-button"
            size="small"
            sx={{
                minWidth: 'unset', // Remove the default min-width
                backgroundColor: props.addCourseOpen ? 'white' : 'transparent',
                width: 'fit-content', // Set the width to fit the content
                borderRadius: '100%', // Set the border radius to make it circular
                border: '1px solid #ccc',
                '&:hover': {
                    backgroundColor: 'white', // Change the background color on hover
                },
            }}
            onClick={() => props.setAddCourseOpen(!props.addCourseOpen)}
        >
            <AddIcon style={{ color: props.addCourseOpen ? 'blue' : 'white' }} />
        </Button>
    )
}