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
  startTime: number;
  userId: string;
  lastMileDistance: number;
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
  properties: {
    id: number;
    name: string;
    mileData: MileData[];
    lastMileDistance: number;
  };
}

export type MileData = {
  index: number;
  elevationGain: number;
  elevationLoss: number;
  pace: number;
  mileVertProfile: number[];
  stopTime: number;
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
