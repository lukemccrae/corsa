import Button from '@mui/material/Button';
import SaveIcon from '@mui/icons-material/Save';
import { useUser } from './context/UserContext';
import { Plan } from './types';

interface PublishButtonProps {
    label: string
    plan: Plan
}

export const PublishCourse = (props: PublishButtonProps) => {
    const { user } = useUser()

    const onSave = async () => {
        if (user?.userId) {
            const userId = user.userId
            const plan = props.plan
            await publishCourse({ userId, plan })
        }
    }

    return (
        <>
            <Button
                variant="contained"
                color="error"
                startIcon={<SaveIcon />}
                onClick={onSave}
                sx={{ backgroundColor: '#469CE3', '&:hover': {} }}
            >
                {props.label}
            </Button>
        </>
    );
};