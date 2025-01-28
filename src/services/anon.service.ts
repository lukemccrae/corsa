import { SignatureV4 } from "@aws-sdk/signature-v4";
import { Sha256 } from "@aws-crypto/sha256-js";
import { HttpRequest } from "@aws-sdk/protocol-http";
import { domain } from "../context/domain.context";
import { Anon } from "../context/UserContext";

// Your AppSync API endpoint
const APPSYNC_ENDPOINT = domain.appsync;

export const anonFetch = async (query: string, anon: Anon) => {

  // Prepare HTTP request
  const request = new HttpRequest({
    method: "POST",
    hostname: new URL(APPSYNC_ENDPOINT).hostname,
    path: "/graphql",
    headers: {
      "Content-Type": "application/json",
      host: new URL(APPSYNC_ENDPOINT).hostname,
    },
    body: JSON.stringify({ query }),
  });

  // Sign the request using SignatureV4
  const signer = new SignatureV4({
    credentials: anon,
    region: "us-west-1",  // Replace with your AWS region
    service: "appsync",
    sha256: Sha256,
  });

  const signedRequest = await signer.sign(request);

  // Send the signed request using fetch API
  const response = await fetch(APPSYNC_ENDPOINT, {
    method: signedRequest.method,
    headers: signedRequest.headers,
    body: signedRequest.body,
  });

  const responseData = await response.json();
  return responseData;
}

export const fetchMapDetails = async (bucketKey: string, anon: Anon) => {
  const query = `
    query MyQuery {
      getGeoJsonBySortKey(sortKey: "${bucketKey}") {
        type
        features {
          properties {
            id
            minPace
            minGrade
          }
        }
      }
    }

  `
  const result = await anonFetch(query, anon);
  return result;
}

export const fetchPublishedPlans = async (anon: Anon) => {
  const query = `
    query MyQuery {
      getPublishedPlans {
        id
        name
        coverImage
        author
        profilePhoto
      }
    }
  `;
  const result = await anonFetch(query, anon);
  return result;
}

export const fetchPlanDetails = async (userId: string, bucketKey: string, anon: Anon) => {
  const query = `
    query MyQuery {
      getPlanById(planId: "${bucketKey}", userId: "${userId}") {
        articleContent
        distanceInMiles
        durationInSeconds
        gainInMeters
        gap
        id
        lastMileDistance
        lossInMeters
        mileData {
          elevationGain
          elevationLoss
          gap
          mileVertProfile
          pace
          stopTime
        }
        name
        published
        startTime
        userId
        timezone
        coverImage
        profilePhoto
        author
      }
    }

  `;
  const result = await anonFetch(query, anon);
  return result;

}