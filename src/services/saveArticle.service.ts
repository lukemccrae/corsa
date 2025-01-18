import { User } from '../types';
import { domain } from "../context/domain.context";
import { retrieveUserToken } from '../helpers/token.helper';

interface SaveArticleProps {
    article: string;
    bucketKey: string;
    userId: string;
}

export const saveArticle = async (props: SaveArticleProps) => {
    const mutation = `
        mutation MyMutation($bucketKey: ID!, $userId: String!, $articleContent: String!) {
        updateArticleByPlanId(
            bucketKey: $bucketKey,
            userId: $userId,
            articleContent: $articleContent
        ) {
            success
        }
        }
  `;

    const variables = {
        bucketKey: props.bucketKey,
        userId: props.userId,
        articleContent: JSON.stringify(props.article),
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
        console.log(jsonResult, '<< hihihi')
        if (jsonResult.data.updateArticleByPlanId) {
            return true;
        } else {
            return false
        }

    } catch (e) {
        console.log(e, "<< error");
    }
};
