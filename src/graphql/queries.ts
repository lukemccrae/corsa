/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getPlansByUserId = /* GraphQL */ `query GetPlansByUserId($userId: ID!) {
  getPlansByUserId(userId: $userId) {
    slug
    bucketKey
    userId
    name
    startTime
    mileData {
      elevationGain
      elevationLoss
      pace
      mileVertProfile
      stopTime
      gap
      __typename
    }
    timezone
    lastMileDistance
    distanceInMiles
    gainInMeters
    lossInMeters
    durationInSeconds
    gap
    articleContent
    published
    coverImage
    profilePhoto
    author
    publishDate
    articleElements {
      ... on TextElement {
        id
      }
      ... on ImageElement {
        url
        id
      }
      ... on PaceTableElement {
        id
      }
    }
    activityType
    subHeading
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetPlansByUserIdQueryVariables,
  APITypes.GetPlansByUserIdQuery
>;
export const getGeoJsonByBucketKey = /* GraphQL */ `query GetGeoJsonByBucketKey($bucketKey: String!) {
  getGeoJsonByBucketKey(bucketKey: $bucketKey) {
    features {
      type
      __typename
    }
    type
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetGeoJsonByBucketKeyQueryVariables,
  APITypes.GetGeoJsonByBucketKeyQuery
>;
export const getPlanById = /* GraphQL */ `query GetPlanById($slug: ID!, $userId: ID!) {
  getPlanById(slug: $slug, userId: $userId) {
    slug
    bucketKey
    userId
    name
    startTime
    mileData {
      elevationGain
      elevationLoss
      pace
      mileVertProfile
      stopTime
      gap
      __typename
    }
    timezone
    lastMileDistance
    distanceInMiles
    gainInMeters
    lossInMeters
    durationInSeconds
    gap
    articleContent
    published
    coverImage
    profilePhoto
    author
    publishDate
    articleElements {
      ... on TextElement {
        id
      }
      ... on ImageElement {
        url
        id
      }
      ... on PaceTableElement {
        id
      }
    }
    activityType
    subHeading
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetPlanByIdQueryVariables,
  APITypes.GetPlanByIdQuery
>;
export const getPublishedPlans = /* GraphQL */ `query GetPublishedPlans {
  getPublishedPlans {
    slug
    bucketKey
    userId
    name
    startTime
    mileData {
      elevationGain
      elevationLoss
      pace
      mileVertProfile
      stopTime
      gap
      __typename
    }
    timezone
    lastMileDistance
    distanceInMiles
    gainInMeters
    lossInMeters
    durationInSeconds
    gap
    articleContent
    published
    coverImage
    profilePhoto
    author
    publishDate
    articleElements {
      ... on TextElement {
        id
      }
      ... on ImageElement {
        url
        id
      }
      ... on PaceTableElement {
        id
      }
    }
    activityType
    subHeading
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetPublishedPlansQueryVariables,
  APITypes.GetPublishedPlansQuery
>;
export const getUserByUsername = /* GraphQL */ `query GetUserByUsername($username: String!) {
  getUserByUsername(username: $username) {
    profilePicture
    bio
    plans {
      slug
      bucketKey
      userId
      name
      startTime
      timezone
      lastMileDistance
      distanceInMiles
      gainInMeters
      lossInMeters
      durationInSeconds
      gap
      articleContent
      published
      coverImage
      profilePhoto
      author
      publishDate
      activityType
      subHeading
      __typename
    }
    userId
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetUserByUsernameQueryVariables,
  APITypes.GetUserByUsernameQuery
>;
export const getPublishedUserInfo = /* GraphQL */ `query GetPublishedUserInfo($username: String!) {
  getPublishedUserInfo(username: $username) {
    profilePicture
    bio
    plans {
      slug
      bucketKey
      userId
      name
      startTime
      timezone
      lastMileDistance
      distanceInMiles
      gainInMeters
      lossInMeters
      durationInSeconds
      gap
      articleContent
      published
      coverImage
      profilePhoto
      author
      publishDate
      activityType
      subHeading
      __typename
    }
    userId
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetPublishedUserInfoQueryVariables,
  APITypes.GetPublishedUserInfoQuery
>;
