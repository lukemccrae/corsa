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
import { haversineInFeet } from './helpers/haversine.helper'
import { toHHMMSS } from "./helpers/avgPace.helper";

export const Details = () => {
  const { id } = useParams();
  const { user } = useUser();
  const [plan, setPlan] = React.useState<Plan>();
  const [map, setMap] = React.useState<number[][]>();
  const [coordTimes, setCoordTimes] = React.useState<string[]>();
  const [hoveredPoint, setHoveredPoint] = React.useState<number>(0);
  // condensedPointIndex is a way for the pace calculations to be on the same index with the elevation profile
  // elevation profile is shortened version of points so this guides indexing the map array

  React.useEffect(() => {
    if (id && user) {
      const userId = user.userId;
      const planId = id;

      const fetchPlan = async () => {
        const planResult: Plan = await getPlanById({ userId, planId });
        const mapResult = await getGeoJsonBySortKey({ planId });

        setPlan(planResult);
        setMap(mapResult.features[0].geometry.coordinates);
        setCoordTimes(mapResult.features[0].properties.coordTimes)
      };
      fetchPlan();
    }
  }, [id, user]);

  const calcPace = () => {
    function getTime(points: number[][], times: string[]) {
      let distance = 0;
      let time = 0;

      for (let i = 0; i < points.length - 1; i++) {
        let feetBetweenPoints = haversineInFeet(points[i][1], points[i][0], points[i + 1][1], points[i + 1][0])
        distance += feetBetweenPoints;
        let time1 = new Date(times[i]).getTime();
        let time2 = new Date(times[i + 1]).getTime();
        time += time2 - time1;
      }
      const timeInSeconds = time / 1000
      return toHHMMSS(timeInSeconds / (distance / 5280))
    }

    function calcElapsed() {
      if (coordTimes) {
        let time1 = new Date(coordTimes[0]).getTime();
        let time2 = new Date(coordTimes[hoveredPoint]).getTime();
        return toHHMMSS((time2 - time1) / 1000);
      }
    }

    if (map && coordTimes) {
      // get distance
      const range = 10;
      const pace = getTime(
        map.slice(hoveredPoint - range, hoveredPoint + range),
        coordTimes.slice(hoveredPoint - range, hoveredPoint + range)
      );

      return (
        <div>
          <div>{pace} min / mile</div>
          <div>{calcElapsed()} elapsed time</div>
        </div>
      )
    }
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
            overflowX: 'auto'
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
              alignItems: 'flex-start'
            }}
          >
            {map && <Typography>{Math.round(map[hoveredPoint][2] * 3.28084) + " ft."}</Typography>}
            {coordTimes && <Typography>{calcPace()}</Typography>}
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
            <MapComponent hoverPoint={map && map[hoveredPoint]} map={map}></MapComponent>
          </Box>
        </Grid>
      </Box>
    );
  } else {
    return <div></div>;
  }
};
