import React from "react";
import { PaceTable } from "./PaceTable";
import { Link, useParams } from "react-router-dom";
import { useUser } from "./context/UserContext";
import { getPlanById } from "./services/fetchPlans.service";
import { FeatureCollection, FeatureProperties, Plan } from "./types";
import { Box, Grid } from "@mui/material";
import { MapComponent } from "./MapComponent";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getGeoJsonBySortKey } from "./services/fetchMap.service";
import { DeleteCourse } from "./DeleteCourse";

import AreaChart from "./testChart";


export const Details = () => {
  const { id } = useParams();
  const { user } = useUser();
  const [plan, setPlan] = React.useState<Plan>();
  const [coords, setCoords] = React.useState<number[][]>();
  const [properties, setProperties] = React.useState<FeatureProperties>();
  const [hoveredPoint, setHoveredPoint] = React.useState<number>(0);



  // condensedPointIndex is a way for the pace calculations to be on the same index with the elevation profile
  // elevation profile is shortened version of points so this guides indexing the map array

  React.useEffect(() => {
    if (id && user) {
      const userId = user.userId;
      const planId = id;

      const fetchPlan = async () => {
        const planResult: Plan = await getPlanById({ userId, planId });
        const mapResult: FeatureCollection = await getGeoJsonBySortKey({ planId });
        setPlan(planResult);
        setCoords(mapResult.features[0].geometry.coordinates);
        setProperties(mapResult.features[0].properties)
      };
      fetchPlan();
    }
  }, [id, user]);

  const elevationWidth = 500;

  const handleSetHoveredPoint = (x: number) => {
    if(properties) {
      setHoveredPoint(Math.round((x / elevationWidth) * properties.pointMetadata.length))
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Link to="/app" style={{ color: '#515B63' }}>
              <ArrowBackIcon />
            </Link>
            <DeleteCourse planId={plan.id} label={"Delete"}></DeleteCourse>
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
            {/* {coords && <Typography sx={{ color: 'black' }}>{Math.round(coords[hoveredPoint][2] * 3.28084) + " ft."}</Typography>}
            {cumulativeDistance && <Typography sx={{ color: 'black' }}>{(cumulativeDistance[hoveredPoint] / 5280).toFixed(2)} mi.</Typography>}
            {pace && <Typography sx={{ color: 'black' }}>{toHHMMSS((pace[hoveredPoint]))} / mi.</Typography>}
            {grade && <Typography sx={{ color: 'black' }}>{(grade[hoveredPoint] * 100).toFixed(2)}% grade</Typography>}
            {coordTimes && <Typography sx={{ color: 'black' }}>{calcElapsed(coordTimes[0], coordTimes[hoveredPoint])} elapsed</Typography>}
            {(min && max) && <Elevation min={min} max={max} setHoveredPoint={setHoveredPoint} multiplyPadding={1} points={coords}></Elevation>} */}
            {properties && <AreaChart handleSetHoveredPoint={handleSetHoveredPoint} hoveredPoint={hoveredPoint} properties={properties} width={elevationWidth} height={300}></AreaChart>}
            {/* <Box sx={{margin: "30px"}}></Box> */}
            {/* {properties && <AreaChart2 properties={properties} width={500} height={500}></AreaChart2>} */}

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
            <MapComponent hoverPoint={coords && coords[hoveredPoint]} coords={coords}></MapComponent>
          </Box>
        </Grid>
      </Box>
    );
  } else {
    return <div></div>;
  }
};
