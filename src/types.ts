export interface User {
  email: string;
  userId: string;
  exp: number;
  // access_token: string;
  // profile: string;
}

export type Plan = {
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
};

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