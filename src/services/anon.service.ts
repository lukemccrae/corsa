import { SignatureV4 } from "@aws-sdk/signature-v4";
import { Sha256 } from "@aws-crypto/sha256-js";
import { HttpRequest } from "@aws-sdk/protocol-http";
import { domain } from "../context/domain.context";
import { Anon } from "../context/UserContext";
import { User } from "../types";

interface GetPublishedUserInfoProps {
  username: String;
  anon: Anon;
}

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
    region: "us-west-1", // Replace with your AWS region
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
};

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

  `;
  const result = await anonFetch(query, anon);
  return result;
};

export const getPublishedUserInfo = async (
  props: GetPublishedUserInfoProps
) => {
  const query = `
    query MyQuery {
      getPublishedUserInfo(username: "${props.username}") {
        profilePicture
        bio
        plans {
          name
          slug
          lastMileDistance
          distanceInMiles
          gainInMeters
          lossInMeters
          published
          mileData {
            mileVertProfile
            pace
          }
          startTime
        }

      }
    }
  `;

  const result = await anonFetch(query, props.anon);
  return result;
};

export const fetchPublishedPlans = async (anon: Anon) => {
  const query = `
    query MyQuery {
      getPublishedPlans {
        name
        coverImage
        profilePhoto
        author
        slug
      }
    }
  `;
  const result = await anonFetch(query, anon);
  return result;
};

export const fetchPlanDetails = async (
  userId: string,
  slug: string,
  anon: Anon
) => {
  const query = `
    query MyQuery {
      getPlanById(slug: "${slug}", userId: "${userId}") {
        activityType
        distanceInMiles
        durationInSeconds
        gainInMeters
        gap
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
        activityType
        published
        startTime
        userId
        coverImage
        profilePhoto
        author
        publishDate
        articleElements {
          ... on TextElement {
            text {
              content
            }
          }
          ... on PaceTableElement {
            paceTable {
              columns
              miles
            }
          }
        }
      }
    }
  `;
  const result = await anonFetch(query, anon);
  return result;
};
