import { retrieveUserToken } from "../helpers/token.helper";

export const handleFileUpload = async (gpx: string, userId: string, setProgress: Function, setAddCourseOpen: Function) => {
  console.log(gpx, userId, '<< gpx, userId')
  const formMutationQuery = (uuid: string) => {
    const query = `
    mutation MyMutation {
      createPlanFromGeoJson(gpxId: "${uuid}", userId: "${userId}") {
        success
      }
    }
  `;
    return query;
  };
  try {
    setProgress(10)
    // retrieve presigned URL for uploading object to S3
    const presignedResponse = await fetch(
      "https://85fn1e2pyk.execute-api.us-west-1.amazonaws.com/prod/gpx-presigned",
      {
        method: "GET",
      }
    );
    console.log(presignedResponse, '<< presignedResponse')
    setProgress(25)

    // resources for uploading to s3
    const { url, uuid } = await presignedResponse.json();
    const uploadResult = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/xml",
      },
      body: gpx,
    });
    setProgress(55)


    if (!uploadResult.ok) throw new Error("Failed to upload to S3");

    const query = formMutationQuery(uuid);

    const response = await fetch(
      // "http://localhost:8008/graphql",
      "https://kgqcfb54prhcvdbezgbmfh2qi4.appsync-api.us-west-1.amazonaws.com/graphql",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${retrieveUserToken()}`,
        },
        body: JSON.stringify({ query }),
      }
    );


    const data = await response.json();
    console.log(data);
    setAddCourseOpen(false)
    setProgress(0)
    return data;
  } catch (e) {
    console.log(e);
  }
};
