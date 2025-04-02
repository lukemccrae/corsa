import { domain } from "../context/domain.context";
import { retrieveUserToken } from "../helpers/token.helper";
import { User } from "../types";

interface GetPlansByUserIdProps {
  user: User;
}

interface GetPlanByIdProps {
  userId: string;
  slug: string;
}

export const getPlansByUserId = async (props: GetPlansByUserIdProps) => {
  const query = `
        query MyQuery {
          getPlansByUserId(userId: "${props.user.preferred_username}") {
            name
            slug
            userId
            lastMileDistance
            distanceInMiles
            gainInMeters
            lossInMeters
            mileData {
              mileVertProfile
              pace
              elevationGain
            }
            startTime
            bucketKey
          }
        }
      `;
  try {
    const result = await fetch(domain.appsync, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${props.user.idToken}`,
      },
      body: JSON.stringify({ query }),
    });
    const plans = await result.json();
    return plans.data.getPlansByUserId;
  } catch (e) {
    console.log(e, "<< error");
  }
};

export const getPlanById = async (props: GetPlanByIdProps) => {
  const query = ` 
    query MyQuery {
      getPlanById(userId: "${props.userId}" slug: "${props.slug}") {
        articleElements {
          ... on TextElement {
            text {
              content
            }
              id
          }
          ... on PaceTableElement {
            paceTable {
              columns
              miles
            }
              id
          }
        }
        distanceInMiles
        bucketKey
        activityType
            lastMileDistance
            lossInMeters
            gainInMeters
            profilePhoto
            gap
            startTime
            userId
            author
            mileData {
              elevationGain
              gap
              mileVertProfile
              stopTime
              pace
              elevationLoss
            }
            name
            published
            slug
            
      }
    }
  `;
  try {
    let token = localStorage.getItem("user");
    if (typeof token !== "string") throw new Error("token not valid");
    const result = await fetch(domain.appsync, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${retrieveUserToken()}`,

        // Authorization: `Bearer ${JSON.stringify(token)}`,
      },
      body: JSON.stringify({ query }),
    });
    const plans = await result.json();

    return plans.data.getPlanById;
  } catch (e) {
    console.log(e, "<< error");
  }
};
