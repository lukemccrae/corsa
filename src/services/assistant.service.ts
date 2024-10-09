import { domain } from "../context/domain.context";
import { retrieveUserToken } from "../helpers/token.helper";

export const handleAssistantCall = async (messages: string[]) => {

  try {
    const response = await fetch(
        // "http://localhost:8008/graphql",
        `${domain.utilityApi}/corsa-assistant`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${retrieveUserToken()}`,
          },
          body: JSON.stringify({ messages }),
        }
      );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
  
    return data;
  } catch (e) {
    console.log(e);
  }
};