/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type PlanInput = {
  userId: string,
  sortKey: string,
  planName: string,
  startTime: number,
  // start time of the event
  paces: Array< number >,
  articleContent: string,
};

export type UpdatedPlan = {
  __typename: "UpdatedPlan",
  success: boolean,
};

export type CreatedPlan = {
  __typename: "CreatedPlan",
  success: boolean,
};

export type DeletePlan = {
  __typename: "DeletePlan",
  success: boolean,
};

export type UpdatedArticle = {
  __typename: "UpdatedArticle",
  success: boolean,
};

export type PublishedPlan = {
  __typename: "PublishedPlan",
  success: boolean,
};

export type Waypoint = {
  __typename: "Waypoint",
  lat?: string | null,
  long?: string | null,
};

export type Plan = {
  __typename: "Plan",
  slug?: string | null,
  bucketKey?: string | null,
  userId?: string | null,
  name?: string | null,
  startTime?: string | null,
  // start time of the event
  mileData?:  Array<MileData | null > | null,
  // an array of mile information
  timezone?: string | null,
  lastMileDistance?: number | null,
  distanceInMiles?: number | null,
  gainInMeters?: number | null,
  lossInMeters?: number | null,
  durationInSeconds?: number | null,
  gap?: number | null,
  articleContent?: string | null,
  published?: boolean | null,
  coverImage?: string | null,
  profilePhoto?: string | null,
  author?: string | null,
  publishDate?: string | null,
  articleElements?:  Array<ArticleElement | null > | null,
  activityType?: string | null,
  subHeading?: string | null,
};

export type MileData = {
  __typename: "MileData",
  elevationGain: number,
  elevationLoss: number,
  pace?: number | null,
  // in seconds per mile
  mileVertProfile?: Array< number | null > | null,
  stopTime?: number | null,
  gap?: number | null,
};

export type ArticleElement = TextElement | ImageElement | PaceTableElement


export type TextElement = {
  __typename: "TextElement",
  text?: Text | null,
  id: string,
};

export type Text = {
  __typename: "Text",
  content?: string | null,
  editing?: boolean | null,
};

export type ImageElement = {
  __typename: "ImageElement",
  url?: string | null,
  id: string,
};

export type PaceTableElement = {
  __typename: "PaceTableElement",
  paceTable?: PaceTable | null,
  id: string,
};

export type PaceTable = {
  __typename: "PaceTable",
  columns?: Array< string | null > | null,
  miles?: Array< number | null > | null,
};

export type FeatureCollection = {
  __typename: "FeatureCollection",
  features?:  Array<Feature > | null,
  type?: string | null,
};

export type Feature = {
  __typename: "Feature",
  type: string,
  geometry: Geometry,
  properties?: GeoProperties | null,
};

export type Geometry = {
  __typename: "Geometry",
  type?: string | null,
  coordinates?: Array< Array< number | null > | null > | null,
};

export type GeoProperties = {
  __typename: "GeoProperties",
  id?: number | null,
  name?: string | null,
  mileData?:  Array<S3MileData | null > | null,
  lastMileDistance?: number | null,
  coordTimes?: Array< string | null > | null,
  pointMetadata?:  Array<PointMetadata | null > | null,
  maxElevationInFeet?: number | null,
  minElevationInFeet?: number | null,
  minGrade?: number | null,
  maxGrade?: number | null,
  minPace?: number | null,
  maxPace?: number | null,
};

export type S3MileData = {
  __typename: "S3MileData",
  elevationGain: number,
  elevationLoss: number,
  index: number,
  // starting index for this mile in the coordinates
  stopTime: number,
};

export type PointMetadata = {
  __typename: "PointMetadata",
  cumulativeDistance?: number | null,
  grade?: number | null,
  pace?: number | null,
  elevation?: number | null,
  time?: string | null,
};

export type User = {
  __typename: "User",
  profilePicture?: string | null,
  bio?: string | null,
  plans?:  Array<Plan | null > | null,
  userId?: string | null,
};

export type UpdatePlanByIdMutationVariables = {
  planInput: PlanInput,
};

export type UpdatePlanByIdMutation = {
  updatePlanById:  {
    __typename: "UpdatedPlan",
    success: boolean,
  },
};

export type CreatePlanFromGeoJsonMutationVariables = {
  gpxId: string,
  userId: string,
  username: string,
};

export type CreatePlanFromGeoJsonMutation = {
  createPlanFromGeoJson:  {
    __typename: "CreatedPlan",
    success: boolean,
  },
};

export type DeletePlanByIdMutationVariables = {
  slug: string,
  userId: string,
  bucketKey: string,
};

export type DeletePlanByIdMutation = {
  deletePlanById:  {
    __typename: "DeletePlan",
    success: boolean,
  },
};

export type UpdateArticleByPlanIdMutationVariables = {
  slug: string,
  userId: string,
  articleElements: string,
  planName: string,
};

export type UpdateArticleByPlanIdMutation = {
  updateArticleByPlanId:  {
    __typename: "UpdatedArticle",
    success: boolean,
  },
};

export type PublishPlanMutationVariables = {
  slug: string,
  userId: string,
  published: boolean,
};

export type PublishPlanMutation = {
  publishPlan:  {
    __typename: "PublishedPlan",
    success: boolean,
  },
};

export type PublishWaypointMutationVariables = {
  lat: string,
  long: string,
};

export type PublishWaypointMutation = {
  publishWaypoint:  {
    __typename: "Waypoint",
    lat?: string | null,
    long?: string | null,
  },
};

export type GetPlansByUserIdQueryVariables = {
  userId: string,
};

export type GetPlansByUserIdQuery = {
  getPlansByUserId?:  Array< {
    __typename: "Plan",
    slug?: string | null,
    bucketKey?: string | null,
    userId?: string | null,
    name?: string | null,
    startTime?: string | null,
    // start time of the event
    mileData?:  Array< {
      __typename: "MileData",
      elevationGain: number,
      elevationLoss: number,
      pace?: number | null,
      // in seconds per mile
      mileVertProfile?: Array< number | null > | null,
      stopTime?: number | null,
      gap?: number | null,
    } | null > | null,
    // an array of mile information
    timezone?: string | null,
    lastMileDistance?: number | null,
    distanceInMiles?: number | null,
    gainInMeters?: number | null,
    lossInMeters?: number | null,
    durationInSeconds?: number | null,
    gap?: number | null,
    articleContent?: string | null,
    published?: boolean | null,
    coverImage?: string | null,
    profilePhoto?: string | null,
    author?: string | null,
    publishDate?: string | null,
    articleElements:  Array<( {
        __typename: "TextElement",
        id: string,
      } | {
        __typename: "ImageElement",
        url?: string | null,
        id: string,
      } | {
        __typename: "PaceTableElement",
        id: string,
      }
    ) | null > | null,
    activityType?: string | null,
    subHeading?: string | null,
  } | null > | null,
};

export type GetGeoJsonByBucketKeyQueryVariables = {
  bucketKey: string,
};

export type GetGeoJsonByBucketKeyQuery = {
  getGeoJsonByBucketKey:  {
    __typename: "FeatureCollection",
    features?:  Array< {
      __typename: "Feature",
      type: string,
    } > | null,
    type?: string | null,
  },
};

export type GetPlanByIdQueryVariables = {
  slug: string,
  userId: string,
};

export type GetPlanByIdQuery = {
  getPlanById:  {
    __typename: "Plan",
    slug?: string | null,
    bucketKey?: string | null,
    userId?: string | null,
    name?: string | null,
    startTime?: string | null,
    // start time of the event
    mileData?:  Array< {
      __typename: "MileData",
      elevationGain: number,
      elevationLoss: number,
      pace?: number | null,
      // in seconds per mile
      mileVertProfile?: Array< number | null > | null,
      stopTime?: number | null,
      gap?: number | null,
    } | null > | null,
    // an array of mile information
    timezone?: string | null,
    lastMileDistance?: number | null,
    distanceInMiles?: number | null,
    gainInMeters?: number | null,
    lossInMeters?: number | null,
    durationInSeconds?: number | null,
    gap?: number | null,
    articleContent?: string | null,
    published?: boolean | null,
    coverImage?: string | null,
    profilePhoto?: string | null,
    author?: string | null,
    publishDate?: string | null,
    articleElements:  Array<( {
        __typename: "TextElement",
        id: string,
      } | {
        __typename: "ImageElement",
        url?: string | null,
        id: string,
      } | {
        __typename: "PaceTableElement",
        id: string,
      }
    ) | null > | null,
    activityType?: string | null,
    subHeading?: string | null,
  },
};

export type GetPublishedPlansQueryVariables = {
};

export type GetPublishedPlansQuery = {
  getPublishedPlans?:  Array< {
    __typename: "Plan",
    slug?: string | null,
    bucketKey?: string | null,
    userId?: string | null,
    name?: string | null,
    startTime?: string | null,
    // start time of the event
    mileData?:  Array< {
      __typename: "MileData",
      elevationGain: number,
      elevationLoss: number,
      pace?: number | null,
      // in seconds per mile
      mileVertProfile?: Array< number | null > | null,
      stopTime?: number | null,
      gap?: number | null,
    } | null > | null,
    // an array of mile information
    timezone?: string | null,
    lastMileDistance?: number | null,
    distanceInMiles?: number | null,
    gainInMeters?: number | null,
    lossInMeters?: number | null,
    durationInSeconds?: number | null,
    gap?: number | null,
    articleContent?: string | null,
    published?: boolean | null,
    coverImage?: string | null,
    profilePhoto?: string | null,
    author?: string | null,
    publishDate?: string | null,
    articleElements:  Array<( {
        __typename: "TextElement",
        id: string,
      } | {
        __typename: "ImageElement",
        url?: string | null,
        id: string,
      } | {
        __typename: "PaceTableElement",
        id: string,
      }
    ) | null > | null,
    activityType?: string | null,
    subHeading?: string | null,
  } | null > | null,
};

export type GetUserByUsernameQueryVariables = {
  username: string,
};

export type GetUserByUsernameQuery = {
  getUserByUsername?:  {
    __typename: "User",
    profilePicture?: string | null,
    bio?: string | null,
    plans?:  Array< {
      __typename: "Plan",
      slug?: string | null,
      bucketKey?: string | null,
      userId?: string | null,
      name?: string | null,
      startTime?: string | null,
      // an array of mile information
      timezone?: string | null,
      lastMileDistance?: number | null,
      distanceInMiles?: number | null,
      gainInMeters?: number | null,
      lossInMeters?: number | null,
      durationInSeconds?: number | null,
      gap?: number | null,
      articleContent?: string | null,
      published?: boolean | null,
      coverImage?: string | null,
      profilePhoto?: string | null,
      author?: string | null,
      publishDate?: string | null,
      activityType?: string | null,
      subHeading?: string | null,
    } | null > | null,
    userId?: string | null,
  } | null,
};

export type GetPublishedUserInfoQueryVariables = {
  username: string,
};

export type GetPublishedUserInfoQuery = {
  getPublishedUserInfo?:  {
    __typename: "User",
    profilePicture?: string | null,
    bio?: string | null,
    plans?:  Array< {
      __typename: "Plan",
      slug?: string | null,
      bucketKey?: string | null,
      userId?: string | null,
      name?: string | null,
      startTime?: string | null,
      // an array of mile information
      timezone?: string | null,
      lastMileDistance?: number | null,
      distanceInMiles?: number | null,
      gainInMeters?: number | null,
      lossInMeters?: number | null,
      durationInSeconds?: number | null,
      gap?: number | null,
      articleContent?: string | null,
      published?: boolean | null,
      coverImage?: string | null,
      profilePhoto?: string | null,
      author?: string | null,
      publishDate?: string | null,
      activityType?: string | null,
      subHeading?: string | null,
    } | null > | null,
    userId?: string | null,
  } | null,
};

export type Subscribe2WaypointsSubscriptionVariables = {
};

export type Subscribe2WaypointsSubscription = {
  subscribe2Waypoints?:  {
    __typename: "Waypoint",
    lat?: string | null,
    long?: string | null,
  } | null,
};
