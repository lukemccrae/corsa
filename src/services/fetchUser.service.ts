import { Anon } from "../context/UserContext";

import { anonFetch } from "./anon.service";

interface FetchUserProps {
    username: String;
    anon: Anon;
}
export const fetchUser = async (props: FetchUserProps) => {
    const query = `
        query MyQuery {
            getUserByUsername(username: "${props.username}") {
                profilePicture
            }
        }
    `;

    try {
        const result = await anonFetch(query, props.anon);
        return result;
    } catch (e) {
        console.log(e, "<< error");
    }
}
