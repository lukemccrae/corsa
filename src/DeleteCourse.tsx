import React from 'react';
import { Button, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { deletePlanById } from './services/deletePlan.service';
import { useUser } from './context/UserContext';

interface DeleteButtonProps {
  label: string;
  slug: string;
  bucketKey: string;
  disabled: boolean;
}

export const DeleteCourse = (props: DeleteButtonProps) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const navigate = useNavigate();
  const { user } = useUser();

  const onDelete = async () => {
    if (user?.userId) {
      const userId = user.userId;
      const slug = props.slug;
      const bucketKey = props.bucketKey;
      await deletePlanById({ userId, slug, bucketKey });
    }

    navigate('/app');
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirmDelete = async () => {
    await onDelete();
    setOpen(false);
  };

  return (
    <>
      <Tooltip title={props.disabled ? 'Published articles cannot be deleted' : ''} arrow>
        <span>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleOpen}
            disabled={props.disabled}
            sx={{
              backgroundColor: '#469CE3',
              '&:hover': {
                backgroundColor: '#357ABD',
              },
            }}
          >
            {props.label}
          </Button>
        </span>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="confirm-delete-title"
        aria-describedby="confirm-delete-description"
      >
        <DialogTitle id="confirm-delete-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-delete-description">
            Are you sure you want to delete this? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
