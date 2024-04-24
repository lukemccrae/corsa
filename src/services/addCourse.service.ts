export const handleFileUpload = async (gpx: string, userId: string) => {
  console.log(gpx, userId, '<< gpx, userId')
  const formMutationQuery = (uuid: string) => {
    const query = `
    mutation MyMutation {
      createPlanFromGeoJson(gpxId: "${uuid}", userId: "${userId}") {
        success
      }
    }
  `;
    console.log(query, '<< query')
    return query;
  };
  try {
    // retrieve presigned URL for uploading object to S3
    const presignedResponse = await fetch(
      "https://85fn1e2pyk.execute-api.us-west-1.amazonaws.com/prod/gpx-presigned",
      {
        method: "GET",
      }
    );

    // resources for uploading to s3
    const { url, uuid } = await presignedResponse.json();
    const uploadResult = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/xml",
      },
      body: gpx,
    });
    console.log(uuid, '<< uuid')

    if (!uploadResult.ok) throw new Error("Failed to upload to S3");

    const query = formMutationQuery(uuid);

    const response = await fetch(
      // "http://localhost:8008/graphql",
      "https://kgqcfb54prhcvdbezgbmfh2qi4.appsync-api.us-west-1.amazonaws.com/graphql",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": `da2-jks23istirg3fm73zd5lecjthy`,
          // 'x-api-key': `${process.env.NEXT_PUBLIC_X_API_KEY}`
          // Authorization: `Bearer ${JSON.stringify(token)}`,
        },
        body: JSON.stringify({ query }),
      }
    );

    const data = await response.json();
    console.log(data);
    return data;
  } catch (e) {
    console.log(e);
  }
};
