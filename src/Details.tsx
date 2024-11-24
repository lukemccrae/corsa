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

  function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const toRadians = (degree: number) => degree * (Math.PI / 180);

    const R = 6371; // Radius of the Earth in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in kilometers
}

  const length = (map: number[][]) => {
    let distance = 0;
    let i = 500;
    
    while(i < map.length - 2) {
      console.log(distance)
      let lat1: number = map[i][0]
      let lat2: number = map[i][1]
      let long1: number = map[i + 1][0]
      let long2: number = map[i + 1][1]

      
      distance += haversine(lat1, long1, lat2, long2)
    }
    return distance;
  }

  const shorten = (map: number[]) => {
    console.log(map, '<< map')
    // shorten points
    // return map;
    return 5;
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
          <div>Points: {map?.length}</div>
          <div>Length:4 {length(map as number [][])}</div>

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
            <div>Points: {map?.length}</div>
            {/* <div>Length: {shorten(map)}</div> */}

            <MapComponent map={map}></MapComponent>
          </Box>
        </Grid>
      </Box>
    );
  } else {
    return <div></div>;
  }
};
