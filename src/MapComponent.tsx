import React from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Box } from '@mui/material';

interface MapComponentProps {
  map: number[][] | undefined
}

export const MapComponent = (props: MapComponentProps) => {
  const mapRef = React.useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = React.useRef<HTMLDivElement | null>(null);
  console.log(props.map, '<< map')

  let geojsonData: GeoJSON.FeatureCollection;
  let points: any[] = [];
  if(props.map) {
    points = props.map.map(arr => arr.slice(0, 2))
    // Type for GeoJSON FeatureCollection
    geojsonData = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: points // Example: New York City
          },
          properties: {
            title: "New York City",
          },
        },
      ],
    };
  }

  React.useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoibHVrZW1jY3JhZSIsImEiOiJjazZ6dzU3YjAxYjFmM2RydmtnZGI5MHdjIn0.nR7kgNT9wb_2QMTYsoeDtQ';
    if (mapContainerRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/outdoors-v11', // Default style
        center: points[(points.length - 1 ) / 2],
        zoom: 12
      });

      // Wait until the map is loaded
      mapRef.current.on('load', () => {
        // Add GeoJSON data as a source
        mapRef.current?.addSource('geojson-data', {
          type: 'geojson',
          data: geojsonData,
        });
        

        // Add a layer to display the GeoJSON
        mapRef.current?.addLayer({
          id: 'geojson-layer',
          type: 'line', // Use a circle for points, you can also use 'line' or 'fill' for other geometry types
          source: 'geojson-data',
          paint: {
            'circle-radius': 8,
            'circle-color': '#ff0000', // Red color for the point
          },
        });
      });
    }

    // Cleanup the map when component unmounts
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  return (
    <>
      <Box id="map-container" ref={mapContainerRef} style={{ height: '50vh', width: '100%' }} />
    </>
  );
};
