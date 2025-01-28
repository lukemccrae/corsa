import { domain } from "../context/domain.context";
import { retrieveUserToken } from "../helpers/token.helper";
import { User } from "../types";

interface GetPlansByUserIdProps {
  user: User;
}

interface GetPlanByIdProps {
  userId: string;
  planId: string;
}

export const getPublishedPlans = async () => {
  const query = `
  query MyQuery {
    getPublishedPlans {
      name
      author
      profilePhoto
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
        },
        body: JSON.stringify({ query }),
      }
    );
    const publishedPlans = await result.json();
    return publishedPlans.data.getPublishedPlans;
  } catch (e) {
    console.log(e, "<< error");
  }
}

export const getPlansByUserId = async (props: GetPlansByUserIdProps) => {
  const query = `
        query MyQuery {
          getPlansByUserId(userId: "${props.user.preferred_username}") {
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
    const result = await fetch(
      domain.appsync,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${props.user.idToken}`,
        },
        body: JSON.stringify({ query }),
      }
    );
    const plans = await result.json();
    console.log(plans, '<< plans')
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
            articleContent
            lastMileDistance
            lossInMeters
            id
            gainInMeters
            gap
            startTime
            userId
            timezone
            mileData {
              elevationGain
              gap
              mileVertProfile
              stopTime
              pace
              elevationLoss
            }
            name
            articleContent
            published
      }
    }
  `;
  try {
    let token = localStorage.getItem("user")
    console.log(token)
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