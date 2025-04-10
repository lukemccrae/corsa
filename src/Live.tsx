import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { useUser } from './context/UserContext';
import L from 'leaflet';
import { generateClient } from 'aws-amplify/api';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import * as subscriptions from './graphql/subscriptions';

import { Amplify } from 'aws-amplify';

Amplify.configure({
  API: {
    GraphQL: {
      endpoint: 'https://mqbakxviyfgxbd62z2ikctwroa.appsync-api.us-west-1.amazonaws.com/graphql',
      region: 'us-west-1',
      // Set the default auth mode to "iam"
      defaultAuthMode: 'iam',
    },
  },
  Auth: {
    Cognito: {
      identityPoolId: 'us-west-1:85bf7267-2f79-43cc-a053-063c7ee03228',
      allowGuestAccess: true,
    },
  },
});

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

export const Live = () => {
  const [waypoints, setWaypoints] = useState<any[]>([
    { long: -118.134181, lat: 37.146508 },
    
  ]);
  const { anon } = useUser();
  const client = generateClient();
  useEffect(() => {
    // Subscribe to creation of Todo
    const subscribe2Waypoints = client
      .graphql({ query: subscriptions.subscribe2Waypoints })
      .subscribe({
        next: ({ data }) => console.log(data),
        error: error => console.warn(error),
      });
    // Remove the national flag in Leaflet attribution control
    const style = document.createElement('style');
    style.innerHTML = `
      .leaflet-control-attribution svg {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
    if (anon) {
      return () => {
        subscribe2Waypoints.unsubscribe();
        document.head.removeChild(style);
      };
    } else {
      return () => {
        document.head.removeChild(style);
      };
    }
  }, [anon]);

  return (
    <Box sx={{ height: '75vh', width: '75vw', position: 'relative' }}>
      <MapContainer
        center={[waypoints[0].lat, waypoints[0].long]} // San Francisco
        zoom={10}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {waypoints.map(waypoint => (
          <Marker position={[waypoint.lat, waypoint.long]}>
            <Popup>
              Latitude: {waypoint.lat} <br />
              Longitude: {waypoint.long}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Box>
  );
};

export default Live;
