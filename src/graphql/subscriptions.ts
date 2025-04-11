/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const subscribe2Waypoints = /* GraphQL */ `subscription Subscribe2Waypoints {
  subscribe2Waypoints {
    lat
    long
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.Subscribe2WaypointsSubscriptionVariables,
  APITypes.Subscribe2WaypointsSubscription
>;
