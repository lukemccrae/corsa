import { domain } from "../context/domain.context";
import { retrieveUserToken } from "../helpers/token.helper";
import { Plan } from "../types";

interface UpdatePlanProps {
    userId: string;
    plan: Plan;
}

// export const updatePlanById = async (props: UpdatePlanProps) => {
//     console.log(props.plan, '<< plan')
//     const query = `
//         mutation MyMutation {
//             deletePlanById(bucketKey: "${props.plan.id}", userId: "${props.userId}") {
//                 success
//             }
//         }
//         `;
//     try {
//         // const result = await fetch(
//         //     domain.appsync,
//         //     {
//         //         method: "POST",
//         //         headers: {
//         //             "Content-Type": "application/json",
//         //             "Authorization": `Bearer ${retrieveUserToken()}`,


//         //         },
//         //         body: JSON.stringify({ query }),
//         //     }
//         // );
//         // const jsonResult = await result.json();
//         // if (jsonResult.success) {
//         //     return true;
//         // } else {
//         //     return false
//         // }

//     } catch (e) {
//         console.log(e, "<< error");
//     }
// };
