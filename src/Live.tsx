import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { useUser } from './context/UserContext';
import L from 'leaflet';

import AWSAppSyncClient, { AUTH_TYPE } from 'aws-appsync';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { gql, Observable } from '@apollo/client';


const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Your subscription query
const subscribe2Waypoints = gql`
  subscription MySubscription {
    subscribe2Waypoints {
      lat
      long
    }
  }
`;

export const Live = () => {
  const [waypoints, setWaypoints] = useState<any[]>([]);
  const { anon } = useUser();
  

  useEffect(() => {
    // Remove the national flag in Leaflet attribution control
    const style = document.createElement('style');
    style.innerHTML = `
      .leaflet-control-attribution svg {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
    if(anon) {
      const client = new AWSAppSyncClient({
        url: 'wss://mqbakxviyfgxbd62z2ikctwroa.appsync-realtime-api.us-west-1.amazonaws.com/graphql',
        region: 'us-west-1',
        auth: {
          type: AUTH_TYPE.AWS_IAM,
          credentials: {
            accessKeyId: anon?.accessKeyId,
            secretAccessKey: anon?.secretAccessKey,
            sessionToken: anon?.sessionToken,
          }, 
        },
        offlineConfig: {
          keyPrefix: `myAppSyncClient-${Math.random().toString(36).substring(7)}`, // Unique keyPrefix
        },
      });

      const observable = client.subscribe({ query: subscribe2Waypoints });
      
      // Set up subscription handler
      const subscription = observable.subscribe({
        next: ({ data }: any) => {
          console.log("✅ SUBSCRIPTION DATA:", data);
          const newData = data?.subscribe2Waypoints;
          setWaypoints((prevWaypoints) => [...prevWaypoints, newData]);
        },
        error: (error: any) => {
          console.warn('Error with subscription:', error);
        },
      });

      return () => {
        // console.log("hi")
        subscription.unsubscribe();
        document.head.removeChild(style);
      };
    } else {
      return () => {
        document.head.removeChild(style);
      }
    }
  }, [anon]);

  return (
    <Box sx={{ height: '75vh', width: '75vw', position: 'relative' }}>
      <MapContainer
        center={[37.7749, -122.4194]} // San Francisco
        zoom={10}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {waypoints.map(waypoint => (
          <Marker position={[waypoint.lat, waypoint.lng]}>
            <Popup>
              <h3>{waypoint.title}</h3>
              <p>{waypoint.content}</p>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Box>
  );
};

export default Live;
