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

  // Cross Product method
  function isCollinear(
    point1: { lat: number, lon: number },
    point2: { lat: number, lon: number },
    point3: { lat: number, lon: number },
    tolerance: number = .00001 // Adjust for tolerable collinearity
  ) {
    const lat1 = point1.lat, lon1 = point1.lon;
    const lat2 = point2.lat, lon2 = point2.lon;
    const lat3 = point3.lat, lon3 = point3.lon;

    // Compute the differences in latitudes and longitudes
    const dx1 = lon2 - lon1;
    const dy1 = lat2 - lat1;
    const dx2 = lon3 - lon1;
    const dy2 = lat3 - lat1;

    // Calculate the cross product (dx1 * dy2 - dy1 * dx2)
    const crossProduct = dx1 * dy2 - dy1 * dx2;

    // Check if the cross product is close to zero within the tolerance
    return Math.abs(crossProduct) <= tolerance;
  }

  // Triangle method
  // function isCollinear(
  //   point1: { lat: number, lon: number },
  //   point2: { lat: number, lon: number },
  //   point3: { lat: number, lon: number },
  //   tolerance: number = .00001 // Adjust for tolerable collinearity
  // ): boolean {
  //   const { lat: lat1, lon: lon1 } = point1;
  //   const { lat: lat2, lon: lon2 } = point2;
  //   const { lat: lat3, lon: lon3 } = point3;

  //   // Calculate the area of the triangle formed by the three points
  //   const area = Math.abs(
  //     lat1 * (lon2 - lon3) +
  //     lat2 * (lon3 - lon1) +
  //     lat3 * (lon1 - lon2)
  //   );

  //   // If the area is less than the tolerance, the points are considered approximately collinear
  //   return area < tolerance;
  // }

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
    return (
      <div>
        <div style={{ color: 'black' }}>Points: {mapPoints?.length}</div>
        <div style={{ color: 'black' }}>Length:{(Math.round(distance) / 5280).toFixed(2)} mi.</div>
      </div>
    )
  }


  function shorten(map: number[][]) {
    let tempMap = map.map(innerArray => [...innerArray]);

    let range = 1
    let i = range;
    let collinear = []

    while (i < tempMap.length - range) {
      if (i % ((range * 2) + 1) === 0) {
        let isStraight: boolean = isCollinear(
          { lat: map[i - range][1], lon: map[i - range][0] },
          { lat: map[i][1], lon: map[i][0] },
          { lat: map[i + range][1], lon: map[i + range][0] })
        if (isStraight) {
          collinear.push(i)
        }
      }
      i++;
    }
    const returnMap = tempMap.filter((_, index) => collinear.includes(index));

    return returnMap;
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

            {map && length(map)}

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
            {map && length(shorten(map))}

            <MapComponent map={map && shorten(map)}></MapComponent>
          </Box>
        </Grid>
      </Box>
    );
  } else {
    return <div></div>;
  }
};
