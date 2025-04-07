import { ArticleElement, User } from "../types";
import { domain } from "../context/domain.context";
import { retrieveUserToken } from "../helpers/token.helper";
import { removeQuotesFromContent } from "../helpers/removeQuotesHelper";

interface SaveArticleProps {
  elements: ArticleElement[];
  slug: string;
  userId: string;
  planName: string;
}

export const saveArticle = async (props: SaveArticleProps) => {
  const mutation = `
        mutation MyMutation($slug: ID!, $userId: String!, $articleElements: String!, $planName: String!) {
        updateArticleByPlanId(
            slug: $slug,
            userId: $userId,
            articleElements: $articleElements
            planName: $planName
        ) {
            success
        }
        }
  `;

  const variables = {
    slug: props.slug,
    userId: props.userId,
    articleElements: JSON.stringify(removeQuotesFromContent(props.elements)),
    planName: props.planName
  };

  try {
    const result = await fetch(
      // "http://localhost:8008/graphql",
      domain.appsync,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${retrieveUserToken()}`,
        },
        body: JSON.stringify({
          query: mutation,
          variables: variables,
        }),
      }
    );
    const jsonResult = await result.json();
    if (jsonResult.data.updateArticleByPlanId) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.log(e, "<< error");
  }
};
