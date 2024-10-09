import { domain } from "../context/domain.context";
import { retrieveUserToken } from "../helpers/token.helper";

interface FetchPlanProps {
  userId: string;
}

export const fetchPlans = async (props: FetchPlanProps) => {
  const query = `
        query MyQuery {
          getPlansByUserId(userId: "${props.userId}") {
            id
            mileData {
              elevationGain
              elevationLoss
              pace
              mileVertProfile
              stopTime
              gap
            }
            name
            startTime
            userId
            lastMileDistance
            gainInMeters
            distanceInMiles
            durationInSeconds
          }
        }
      `;
  try {
    let token = localStorage.getItem("user")
    if (typeof token !== 'string') throw new Error("token not valid")
    const result = await fetch(
      domain.appsync,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${retrieveUserToken()}`,

          // Authorization: `Bearer ${JSON.stringify(token)}`,
        },
        body: JSON.stringify({ query }),
      }
    );
    const plans = await result.json();
    console.log(plans, "<< plans");
    return plans.data.getPlansByUserId;
  } catch (e) {
    console.log(e, "<< error");
  }
};
