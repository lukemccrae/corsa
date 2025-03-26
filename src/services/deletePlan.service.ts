import { domain } from "../context/domain.context";
import { retrieveUserToken } from "../helpers/token.helper";

interface DeletePlanProps {
  userId: string;
  slug: string;
  bucketKey: string;
}

export const deletePlanById = async (props: DeletePlanProps) => {
  const query = `
        mutation MyMutation {
            deletePlanById(slug: "${props.slug}", userId: "${props.userId}", bucketKey: "${props.bucketKey}") {
                success
            }
        }
        `;
  try {
    const result = await fetch(
      // "http://localhost:8008/graphql",
      domain.appsync,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${retrieveUserToken()}`,
        },
        body: JSON.stringify({ query }),
      }
    );
    const jsonResult = await result.json();
    if (jsonResult.success) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.log(e, "<< error");
  }
};
