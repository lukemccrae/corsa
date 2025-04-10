/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const updatePlanById = /* GraphQL */ `mutation UpdatePlanById($planInput: PlanInput!) {
  updatePlanById(planInput: $planInput) {
    success
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdatePlanByIdMutationVariables,
  APITypes.UpdatePlanByIdMutation
>;
export const createPlanFromGeoJson = /* GraphQL */ `mutation CreatePlanFromGeoJson($gpxId: ID!, $userId: ID!, $username: ID!) {
  createPlanFromGeoJson(gpxId: $gpxId, userId: $userId, username: $username) {
    success
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreatePlanFromGeoJsonMutationVariables,
  APITypes.CreatePlanFromGeoJsonMutation
>;
export const deletePlanById = /* GraphQL */ `mutation DeletePlanById($slug: ID!, $userId: String!, $bucketKey: String!) {
  deletePlanById(slug: $slug, userId: $userId, bucketKey: $bucketKey) {
    success
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeletePlanByIdMutationVariables,
  APITypes.DeletePlanByIdMutation
>;
export const updateArticleByPlanId = /* GraphQL */ `mutation UpdateArticleByPlanId(
  $slug: ID!
  $userId: String!
  $articleElements: String!
  $planName: String!
) {
  updateArticleByPlanId(
    slug: $slug
    userId: $userId
    articleElements: $articleElements
    planName: $planName
  ) {
    success
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateArticleByPlanIdMutationVariables,
  APITypes.UpdateArticleByPlanIdMutation
>;
export const publishPlan = /* GraphQL */ `mutation PublishPlan($slug: ID!, $userId: String!, $published: Boolean!) {
  publishPlan(slug: $slug, userId: $userId, published: $published) {
    success
    __typename
  }
}
` as GeneratedMutation<
  APITypes.PublishPlanMutationVariables,
  APITypes.PublishPlanMutation
>;
export const publishWaypoint = /* GraphQL */ `mutation PublishWaypoint($lat: String!, $long: String!) {
  publishWaypoint(lat: $lat, long: $long) {
    lat
    long
    __typename
  }
}
` as GeneratedMutation<
  APITypes.PublishWaypointMutationVariables,
  APITypes.PublishWaypointMutation
>;
