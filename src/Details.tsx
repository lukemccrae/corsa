import React from "react";
import { PaceTable } from "./PaceTable"
import { Link, useParams } from "react-router-dom";
import { useUser } from "./context/UserContext";
import { getPlanById } from "./services/fetchPlans.service";
import { Plan } from "./types";
import { Box, Grid, Tooltip, Typography } from "@mui/material";
import { MapComponent } from "./MapComponent";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getGeoJsonBySortKey } from "./services/fetchMap.service";
import { Elevation } from "./Elevation";

export const Details = () => {
  const { id } = useParams();
  const { user } = useUser();
  const [plan, setPlan] = React.useState<Plan>();
  const [map, setMap] = React.useState<number[][]>()
  const [hoveredPoint, setHoveredPoint] = React.useState<number>(0);


  React.useEffect(() => {
    if (id && user) {
      const userId = user.userId;
      const planId = id;

      const fetchPlan = async () => {
        const planResult: Plan = await getPlanById({ userId, planId });
        const mapResult = await getGeoJsonBySortKey({ planId })

        setPlan(planResult)
        setMap(mapResult.features[0].geometry.coordinates)
      }
      fetchPlan()
    }
  }, [id, user]);

  if (plan) {
    return (
      <Box component="main"
        sx={{
          p: 5,
          display: "flex",
          flexDirection: "column",
          overflow: 'auto',
          padding: 0,
          mt: "64px",
          alignItems: 'flex-start',
          height: "calc(100vh - 64px)",
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
          }}
        >
          <Link
            to="/app"
            style={{ color: '#515B63' }}>
            <ArrowBackIcon />
          </Link>
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
            <PaceTable plan={plan}></PaceTable>
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
            {map && <Typography>{Math.round(map[hoveredPoint][2] * 3.28084) + " ft."}</Typography>}
            <Elevation setHoveredPoint={setHoveredPoint} multiplyPadding= {1} points={map}></Elevation>
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
            <MapComponent map={map}></MapComponent>
          </Box>

        </Grid>
      </Box>
    )
  } else {
    return (<div></div>)
  }
}