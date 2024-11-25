import React from 'react';
import mapboxgl, { GeoJSONSource } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Box } from '@mui/material';

interface MapComponentProps {
  map: number[][] | undefined
  hoverPoint: number[] | undefined
}

export const MapComponent = (props: MapComponentProps) => {
  const mapRef = React.useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = React.useRef<HTMLDivElement | null>(null);

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
        center: points[(points.length - 1 )],
        zoom: 12
      });

      mapRef.current.on('load', () => {
        // resize the map to make it fill width
        // current behavior is glitchy
        mapRef.current?.resize()
        mapRef.current?.addSource('geojson-data', {
          type: 'geojson',
          data: geojsonData,
        });
        
        mapRef.current?.addLayer({
          id: 'geojson-layer',
          type: 'line',
          source: 'geojson-data',
          paint: {
            'circle-radius': 8,
            'circle-color': '#ff0000',
          },
        });

        if(props.hoverPoint) {
          mapRef.current?.addSource('dot-source', {
            type: 'geojson',
            data: {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: props.hoverPoint,
              },
              properties: {},
            },
          });
    
          // Add a circle layer to display the dot
          mapRef.current?.addLayer({
            id: 'dot-layer',
            type: 'circle',
            source: 'dot-source',
            paint: {
              'circle-radius': 10, // Size of the dot
              'circle-color': 'orange', // Color of the dot
            },
          });
        }
      });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  React.useEffect(() => {
    if (mapRef.current?.getSource('dot-source') && props.hoverPoint) {
      const source = mapRef.current.getSource('dot-source') as GeoJSONSource;
      if(source) {
        source.setData({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: props.hoverPoint,
          },
          properties: {},
        });
      }
    }
  }, [props.hoverPoint]);

  return (
    <>
      <Box id="map-container" ref={mapContainerRef} style={{ height: '50vh', width: '100%' }} />
    </>
  );
};
