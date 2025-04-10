import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Box from '@mui/material/Box';
import React from 'react';

export const Live = () => {
  React.useEffect(() => {
    // Dynamically inject the CSS to remove the national flag in Leaflet attribution control
    const style = document.createElement('style');
    style.innerHTML = `
          .leaflet-control-attribution svg {
            display: none !important;
          }
        `;
    document.head.appendChild(style);

    // Clean up the injected style on unmount
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  return (
    <Box sx={{ height: '75vh', width: '75vw' }}>
      <MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[51.505, -0.09]}>
          <Popup>hi hi hi!</Popup>
        </Marker>
      </MapContainer>
    </Box>
  );
};
