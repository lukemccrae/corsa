import { User } from '../types';
import { domain } from "../context/domain.context";
import { retrieveUserToken } from '../helpers/token.helper';

interface PublishCourseProps {
    bucketKey: string;
    user: User;
}

export const publishCourse = async (props: PublishCourseProps) => {
    const mutation = `
`;

    const variables = {
        bucketKey: props.bucketKey,
        userId: props.user.userId,
    };

    try {
        const result = await fetch(
            // "http://localhost:8008/graphql",
            domain.appsync,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${retrieveUserToken()}`,


                },
                body: JSON.stringify({
                    query: mutation,
                    variables: variables
                  })
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
