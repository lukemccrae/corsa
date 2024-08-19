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
            }
            name
            startTime
            userId
            lastMileDistance
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
          // 'x-api-key': `${process.env.NEXT_PUBLIC_X_API_KEY}`
          "x-api-key": "da2-uo4bjy5ah5akdljbau3r4gxwmi",

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
