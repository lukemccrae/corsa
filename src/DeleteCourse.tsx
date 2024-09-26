import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Plan } from "./types";
import React from "react";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { deletePlanById } from "./services/deletePlan.service";

interface DeleteCourseProps {
    plan: Plan
    setPlans: Function
    plans: Plan[]
    setExpandedPlan: Function

}

export const DeleteCourse = (props: DeleteCourseProps) => {
    const [deleteConfirm, setDeleteConfirm] = React.useState<boolean>(false);

    const deletePlan = async () => {
        const planId = props.plan.id;
        const userId = props.plan.userId;
        const updatedPlans = props.plans.filter(p => p.id !== props.plan.id);
        props.setPlans(updatedPlans)
        props.setExpandedPlan(undefined)
        const result = await deletePlanById({ userId, planId })
        // remove plans from local array
    }

    return (
        <div>
            {deleteConfirm ?
                <div>
                    <IconButton
                        onClick={(event) => event.stopPropagation()}
                        sx={{
                            border: '1px solid #ccc',
                            '&:hover': {
                                backgroundColor: 'white', // Change the background color on hover
                            },
                        }}
                    >
                        <CheckIcon onClick={async () => {
                            await deletePlan()
                        }}></CheckIcon>
                    </IconButton>
                    <IconButton
                        onClick={(event) => event.stopPropagation()}
                        sx={{
                            border: '1px solid #ccc',
                            '&:hover': {
                                backgroundColor: 'white', // Change the background color on hover
                            },
                        }}>
                        <CloseIcon onClick={() => { setDeleteConfirm(false) }}></CloseIcon>
                    </IconButton>
                </div>
                :
                (<IconButton
                    onClick={(event) => event.stopPropagation()}
                    aria-label="delete"
                    size="small"
                    sx={{
                        border: '1px solid #ccc',
                        '&:hover': {
                            backgroundColor: 'white', // Change the background color on hover
                        },
                    }}>
                    <DeleteIcon onClick={() => setDeleteConfirm(true)} fontSize="inherit" />
                </IconButton>)}
        </div>
    )
}

