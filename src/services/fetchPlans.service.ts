import { domain } from "../context/domain.context";
import { retrieveUserToken } from "../helpers/token.helper";

interface GetPlansByUserIdProps {
  userId: string;
}

interface GetPlanByIdProps {
  userId: string;
  planId: string;
}

export const getPlansByUserId = async (props: GetPlansByUserIdProps) => {
  const query = `
        query MyQuery {
          getPlansByUserId(userId: "${props.userId}") {
            id
            name
            userId
            lastMileDistance
            distanceInMiles
            gainInMeters
            lossInMeters
            mileData {
              mileVertProfile
              pace
            }
            startTime
            timezone
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
    return plans.data.getPlansByUserId;
  } catch (e) {
    console.log(e, "<< error");
  }
};

export const getPlanById = async (props: GetPlanByIdProps) => {
  const query = ` 
    query MyQuery {
      getPlanById(userId: "${props.userId}" planId: "${props.planId}") {
        distanceInMiles
            durationInSeconds
            lastMileDistance
            lossInMeters
            id
            gainInMeters
            gap
            startTime
            userId
            mileData {
              elevationGain
              gap
              mileVertProfile
              stopTime
              pace
              elevationLoss
            }
            name
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

    return plans.data.getPlanById;
  } catch (e) {
    console.log(e, "<< error");
  }
}