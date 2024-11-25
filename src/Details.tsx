import React from "react";
import { PaceTable } from "./PaceTable";
import { Link, useParams } from "react-router-dom";
import { useUser } from "./context/UserContext";
import { getPlanById } from "./services/fetchPlans.service";
import { Plan } from "./types";
import { Box, Grid, Typography } from "@mui/material";
import { MapComponent } from "./MapComponent";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getGeoJsonBySortKey } from "./services/fetchMap.service";
import { Elevation } from "./Elevation";

export const Details = () => {
  const { id } = useParams();
  const { user } = useUser();
  const [plan, setPlan] = React.useState<Plan>();
  const [map, setMap] = React.useState<number[][]>();
  const [hoveredPoint, setHoveredPoint] = React.useState<number>(0);

  React.useEffect(() => {
    if (id && user) {
      const userId = user.userId;
      const planId = id;

      const fetchPlan = async () => {
        const planResult: Plan = await getPlanById({ userId, planId });
        const mapResult = await getGeoJsonBySortKey({ planId });

        setPlan(planResult);
        setMap(mapResult.features[0].geometry.coordinates);
      };
      fetchPlan();
    }
  }, [id, user]);

  function haversineInFeet(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const toRadians = (degree: number) => degree * (Math.PI / 180);

    const R = 20902688; // Earth's radius in feet
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in feet
  }

  // calculate the overall length of the points to compare fidelity of the GPX tracks
  function length(mapPoints: number[][]) {
    let distance = 0;
    let i = 0

    while (i < mapPoints.length - 1) {
      let lat1: number = mapPoints[i][1]
      let long1: number = mapPoints[i][0]
      let lat2: number = mapPoints[i + 1][1]
      let long2: number = mapPoints[i + 1][0]

      distance += haversineInFeet(lat1, long1, lat2, long2)
      i++;
    }
    return Math.round(distance);

  }

  function isCollinear(
    p1: { lat: number; lon: number },
    p2: { lat: number; lon: number },
    p3: { lat: number; lon: number },
    tolerance: number
  ): boolean {
    // make a triangle out of three points and compare the area
    const area = p1.lat * (p2.lon - p3.lon) +
      p2.lat * (p3.lon - p1.lon) +
      p3.lat * (p1.lon - p2.lon);
    return Math.abs(area) <= tolerance
  }

  function removePoints(map: number[][], tolerance: number) {
    let collinearIndices = new Set<number>();
    // Iterate through the points
    for (let i = 0; i < map.length - 2; i++) {
      const p1 = { lat: map[i][1], lon: map[i][0] };
      const p2 = { lat: map[i + 1][1], lon: map[i + 1][0] };
      const p3 = { lat: map[i + 2][1], lon: map[i + 2][0] };

      // Check if these three points are collinear
      if (isCollinear(p1, p2, p3, tolerance)) {
        // Mark the middle point (p2) for removal
        collinearIndices.add(i + 1);
      }
    }
    // Filter out collinear points
    return map.filter((_, index) => !collinearIndices.has(index));
  }

  function shorten(map: number[][]) {
    // start with base tolerance value that will be decreased in loop iterations
    let tolerance = .000001;
    let iterations = 0;
    const maxIterations = 8;
    const originalLength: number = Number.parseFloat((length(map) / 5280).toFixed(4))
    let shortenedPoints = removePoints(map, tolerance);
    let shortenedLength = Number.parseFloat((length(shortenedPoints) / 5280).toFixed(4))

    // do loop that makes new shortened point arrays if shortenedLength is less than .001 % of original
    while (iterations < maxIterations) {
      shortenedPoints = removePoints(map, tolerance);
      shortenedLength = Number.parseFloat((length(shortenedPoints) / 5280).toFixed(4))

      // degree of difference between route lengths as a percent
      let ratio = (originalLength - shortenedLength) / originalLength;

      // check for tolerable distance difference between shortened route and original
      // increase comparison value to decrease points
      // decrease comparison value to increase route accuracy
      if (ratio > .01) {
        tolerance /= 10;
        iterations++
      } else {
        break;
      }
    }
    return shortenedPoints;
  }

  if (plan) {
    return (
      <Box
        component="main"
        sx={{
          p: 5,
          display: "flex",
          flexDirection: "column",
          padding: 0,
          mt: "64px",
          alignItems: 'flex-start',
          overflow: "auto",
        }}
      >
        <Grid
          container
          item
          xs={12}
          md={12}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            padding: 1,
            height: '100%',
            overflowY: "auto",
          }}
        >
          <Link to="/app" style={{ color: '#515B63' }}>
            <ArrowBackIcon />
          </Link>

          <Box
            sx={{
              backgroundColor: '#e3e3e3',
              borderRadius: 2,
              padding: 2,
              justifyContent: 'center',
              alignItems: 'flex-start',
            }}
          >
            <PaceTable plan={plan}></PaceTable>
          </Box>

          <Box
            sx={{
              backgroundColor: '#e3e3e3',
              borderRadius: 2,
              padding: 2,
              justifyContent: 'center',
              alignItems: 'flex-start',
            }}
          >
            {map && <Typography>{Math.round(map[hoveredPoint][2] * 3.28084) + " ft."}</Typography>}
            <Elevation setHoveredPoint={setHoveredPoint} multiplyPadding={1} points={map}></Elevation>
          </Box>

          <Box
            sx={{
              flex: 1,
              backgroundColor: '#e3e3e3',
              borderRadius: 2,
              padding: 2,
              justifyContent: 'center',
              alignItems: 'flex-start',
            }}
          >
            <h3 style={{ color: 'black' }}>Original Point Array</h3>

            <div>
              <div style={{ color: 'black' }}>Points: {map?.length}</div>
              <div style={{ color: 'black' }}>Length:{(length(map) / 5280).toFixed(2)} mi.</div>
            </div>

            <MapComponent map={map}></MapComponent>
          </Box>


          <Box
            sx={{
              flex: 1,
              backgroundColor: '#e3e3e3',
              borderRadius: 2,
              padding: 2,
              justifyContent: 'center',
              alignItems: 'flex-start',
            }}
          >
            <h3 style={{ color: 'black' }}>Modified Point Array</h3>
            <div>
              <div style={{ color: 'black' }}>Points: {shorten(map).length}</div>
              <div style={{ color: 'black' }}>Length:{(length(shorten(map)) / 5280).toFixed(2)} mi.</div>
            </div>

            <MapComponent map={map && shorten(map)}></MapComponent>
          </Box>
        </Grid>
      </Box>
    );
  } else {
    return <div></div>;
  }
};
