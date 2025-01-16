import Button from '@mui/material/Button';
import SaveIcon from '@mui/icons-material/Save';
import { useUser } from './context/UserContext';
import { Plan } from './types';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { publishCourse } from './services/publishCourse.service';
import React from 'react';

interface PublishButtonProps {
    label: string
    plan: Plan
}

export const PublishCourse = (props: PublishButtonProps) => {
    const { user } = useUser()
    const [open, setOpen] = React.useState<boolean>(false)

    const onSave = async () => {
        if (user?.userId) {
            const userId = user.userId
            const bucketKey = props.plan.id
            await publishCourse({ userId, bucketKey })
        }
    }

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleConfirmPublish = async () => {
        await onSave();
        setOpen(false);
    };

    return (
        <>
            <Button
                variant="contained"
                color="error"
                startIcon={<SaveIcon />}
                onClick={handleOpen}
                sx={{ backgroundColor: '#469CE3', '&:hover': {} }}
            >
                {props.label}
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="confirm-delete-title"
                aria-describedby="confirm-delete-description"
            >
                <DialogTitle id="confirm-delete-title">Confirm Publish</DialogTitle>
                <DialogContent>
                    <DialogContentText id="confirm-delete-description">
                        {props.plan.published ?
                            "Unpublishing will remove this post from public visibility. "
                            : "Publishing will make this activity data and writing available to the world."
                        }
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmPublish} color="success" autoFocus>
                        {props.plan.published ? "Unpublish" : "Publish"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};