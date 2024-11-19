import React from "react";
import { PaceTable } from "./PaceTable"
import { Link, useParams } from "react-router-dom";
import { useUser } from "./context/UserContext";
import { getPlanById } from "./services/fetchPlans.service";
import { Plan } from "./types";
import { Box, Grid, Paper, Typography } from "@mui/material";
import { MileProfile } from "./MileProfile";
import { MapComponent } from "./MapComponent";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getGeoJsonBySortKey } from "./services/fetchMap.service";

interface DetailsProps {
  setSelectedPlan: Function;
  selectedPlan: Plan
}

export const Details = () => {
  const { id } = useParams();
  const { user } = useUser();
  const [plan, setPlan] = React.useState<Plan>();
  const [fullMapProfile, setFullMapProfile] = React.useState<number[]>([]);
  const [map, setMap] = React.useState<number[][]>()

  React.useEffect(() => {
    console.log(id, user)

    if (id && user) {
      const userId = user.userId;
      const planId = id;

      const fetchPlan = async () => {
        const planResult: Plan = await getPlanById({ userId, planId });
        const mapResult = await getGeoJsonBySortKey({planId})

        setPlan(planResult)
        setMap(mapResult.features[0].geometry.coordinates)
        console.log(mapResult)

        let tempFullMapProfile: number[] = [];
        planResult.mileData.forEach((md) => tempFullMapProfile.push(...md.mileVertProfile))
        setFullMapProfile(tempFullMapProfile)
      }
      fetchPlan()
    }
  }, [id]);

  if (plan) {
    return (
      <Box sx={{ p: 5, display: "flex", flexDirection: "column", overflow: 'auto' }}>
        <Grid
          container
          item
          // xs={12} // Full width on small screens
          // md={12}  // Takes 4/12 width on medium and larger screens
          sx={{
            // width: '100%'
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            padding: 1,
            // width: "50vw"
          }}
        >
          <Link
            to="/app"
            style={{ color: '#515B63' }}>
            <ArrowBackIcon />
          </Link>
          {/* Map Component */}
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
            {/* <MileProfile mileVertProfile={fullMapProfile} multiplyPadding={5} color={"black"}></MileProfile> */}
            <MapComponent map={map}></MapComponent>
          </Box>
        </Grid>
      </Box>
    )
  } else {
    return (<div></div>)
  }
}