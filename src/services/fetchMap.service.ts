import { domain } from "../context/domain.context";
import { retrieveUserToken } from "../helpers/token.helper";

interface GetGeoJsonBySortKeyProps {
    planId: string;
}

export const getGeoJsonBySortKey = async (props: GetGeoJsonBySortKeyProps) => {
    const query = `
        query MyQuery {
            getGeoJsonBySortKey(sortKey: "${props.planId}") {
                features {
                    geometry {
                        coordinates
                        type
                    }
                    properties {
                        coordTimes
                        cumulativeDistance
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
        console.log(plans, '<< plans')
        return plans.data.getGeoJsonBySortKey;
    } catch (e) {
        console.log(e, "<< error");
    }
};
