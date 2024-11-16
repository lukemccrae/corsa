import React from "react";
import { PaceTable } from "./PaceTable"
import { useParams } from "react-router-dom";
import { useUser } from "./context/UserContext";
import { getPlanById } from "./services/fetchPlans.service";
import { Plan } from "./types";
interface DetailsProps {
    setSelectedPlan: Function;
    selectedPlan: Plan
}
export const Details = (props: DetailsProps) => {
    const { id } = useParams();
    const { user } = useUser();
    

    React.useEffect(() => {
        if(id && user) {
          const userId = user.userId;
          const planId = id;
    
          const fetchPlan = async () => {
            const plan = await getPlanById({userId, planId});
            props.setSelectedPlan(plan)
          }
          fetchPlan()
        }
      }, [id]);
    
    return (<PaceTable plan={props.selectedPlan}></PaceTable>)
}