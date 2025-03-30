export interface User {
  email: string;
  userId: string;
  exp: number;
  preferred_username: string;
  idToken: string;
  // access_token: string;
  // profile: string;
}

export type PaceTableType = {
  columns: string[]; // This is an enum ["Mile", "Pace", "Profile"]
  miles: number[];   // e.g., [0, 3]
};

export type ArticleElement =
  | { paceTable: PaceTableType, editing: boolean, id: string }
  | { text: Text, editing: boolean, id: string };

export type Text = {
  content: string;
}

export type Plan = {
  slug: string;
  bucketKey: string;
  name: string;
  mileData: MileData[];
  startTime: Date;
  timezone: string;
  userId: string;
  lastMileDistance: number;
  distanceInMiles: number;
  min: number;
  max: number;
  pace: number[];
  grade: number[];
  gainInMeters: number;
  lossInMeters: number;
  articleContent: string;
  published: boolean;
  coverImage: string;
  author: string;
  profilePhoto: string;
  publishDate: string;
  articleElements: ArticleElement[];
};

export interface PartialPlan {
  id: string;
  name: string;
  mileData: MileData[];
  startTime: Date;
  timezone: string;
  userId: string;
  lastMileDistance: number;
  distanceInMiles: number;
  min: number;
  max: number;
  pace: number[];
  grade: number[];
  gainInMeters: number;
  lossInMeters: number;
  articleContent: string;
  published: boolean;
}

export interface getPlansByUserId {
  getPlansByUserId: Plan[];
}

export interface GetPlansByUserId {
  athlete: GetPlansByUserId | undefined;
  data: getPlansByUserId;
}

export interface UpdatePlanById {
  data: {
    updatePlanById: {
      success: Boolean;
    };
  };
}

export type CreatePlanFromGeoJson = {
  data: {
    createPlanFromGeoJson: {
      success: boolean;
    };
  };
};

export type LatLng = [number, number];
export type Altitude = [number];
export type LatLngAltitude = [number, number, number];

export interface Feature {
  type: string;
  geometry: {
    type: string;
    coordinates: LatLngAltitude[];
  };
  properties: FeatureProperties
}

export type FeatureProperties = {
  id: number;
  name: string;
  mileData: MileData[];
  lastMileDistance: number;
  cumulativeDistance: number[];
  coordTimes: string[]
  grade: number[]
  pace: number[]
  minGrade: number;
  maxGrade: number;
  minPace: number;
  maxPace: number;
  maxElevationInFeet: number
  minElevationInFeet: number
  pointMetadata: PointMetadata[]
};

export type MileData = {
  index: number;
  elevationGain: number;
  elevationLoss: number;
  pace: number;
  mileVertProfile: number[];
  stopTime: number;
  gap: number;
};

export interface FeatureCollection {
  type: string;
  features: Feature[];
}

export interface MapViewProps {
  geoJson: GraphQLFeatureCollection;
}

export interface GraphQLFeatureCollection {
  data: GetGeoJsonBySortKey;
}

export interface GetGeoJsonBySortKey {
  getGeoJsonBySortKey: FeatureCollection;
}

export interface Article {
  id: string;
  name: string;
  destination: string;
  author: string;
  date: string;
  image: string;
  tags: string[];
  content: string;
}



export type PointMetadata = {
  grade: number;
  pace: number;
  cumulativeDistance: number;
  elevation: number;
  time: string;
}

export type CognitoToken = {
  aud: string;
  auth_time: number;
  "cognito:username": string;
  email: string;
  email_verified: boolean;
  event_id: string;
  exp: number;
  iat: number;
  iss: string;
  jti: string;
  origin_jti: string;
  sub: string;
  token_use: string;
  preferred_username: string;
  picture: string;
};
