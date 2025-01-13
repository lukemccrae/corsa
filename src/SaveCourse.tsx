import Button from '@mui/material/Button';
import SaveIcon from '@mui/icons-material/Save';
import { updatePlanById } from './services/updatePlan.service';
import { useUser } from './context/UserContext';
import { Plan } from './types';

interface DeleteButtonProps {
    label: string
    plan: Plan
}

export const SaveCourse = (props: DeleteButtonProps) => {
    const { user } = useUser()


    const onSave = async () => {
        if (user?.userId) {
            const userId = user.userId
            const plan = props.plan
            await updatePlanById({ userId, plan })
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