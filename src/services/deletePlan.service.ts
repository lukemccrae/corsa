import { retrieveUserToken } from "../helpers/token.helper";

interface DeletePlanProps {
    userId: string;
    planId: string;
}

export const deletePlanById = async (props: DeletePlanProps) => {
    const query = `
        mutation MyMutation {
            deletePlanById(bucketKey: "${props.planId}", userId: "${props.userId}") {
                success
            }
        }
        `;
    try {
        const result = await fetch(
            "https://kgqcfb54prhcvdbezgbmfh2qi4.appsync-api.us-west-1.amazonaws.com/graphql",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${retrieveUserToken()}`,


                },
                body: JSON.stringify({ query }),
            }
        );
        const jsonResult = await result.json();
        if (jsonResult.success) {
            return true;
        } else {
            return false
        }

    } catch (e) {
        console.log(e, "<< error");
    }
};
