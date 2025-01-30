import { domain } from "../context/domain.context";
import { retrieveUserToken } from "../helpers/token.helper";

interface GetGeoJsonBySortKeyProps {
    bucketKey: string;
}

export const getGeoJsonBySortKey = async (props: GetGeoJsonBySortKeyProps) => {
    const query = `
        query MyQuery {
            getGeoJsonByBucketKey(bucketKey: "${props.bucketKey}") {
                features {
                properties {
                    minElevationInFeet
                    maxElevationInFeet
                    coordTimes
                    id
                    lastMileDistance
                    pointMetadata {
                        pace
                        grade
                        cumulativeDistance
                        elevation
                        time
                    }
                    minGrade
                    maxGrade
                    minPace
                    maxPace
                }
                geometry {
                    coordinates
                }
                }
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
        return plans.data.getGeoJsonBySortKey;
    } catch (e) {
        console.log(e, "<< error");
    }
};
