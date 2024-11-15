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
        // remove plans from local array
        const updatedPlans = props.plans.filter(p => p.id !== props.plan.id);
        props.setPlans(updatedPlans)
        props.setExpandedPlan(undefined)
        const result = await deletePlanById({ userId, planId })
    }

    return (
        <div>
            {deleteConfirm ?
                <div>
                    <IconButton
                        onClick={(event) => {
                            event.stopPropagation()
                            setDeleteConfirm(false)
                        }}
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
                        <CloseIcon></CloseIcon>
                    </IconButton>
                </div>
                :
                (<IconButton
                    onClick={(event) => {
                        event.stopPropagation()
                        setDeleteConfirm(true)
                    }}
                    aria-label="delete"
                    size="small"
                    sx={{
                        border: '1px solid #ccc',
                        '&:hover': {
                            backgroundColor: 'white', // Change the background color on hover
                        },
                    }}>
                    <DeleteIcon fontSize="inherit" />
                </IconButton>)}
        </div>
    )
}

