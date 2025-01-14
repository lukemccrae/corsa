import React from "react";
import { PaceTable } from "./PaceTable";
import { Link, useParams } from "react-router-dom";
import { useUser } from "./context/UserContext";
import { getPlanById } from "./services/fetchPlans.service";
import { FeatureCollection, FeatureProperties, Plan } from "./types";
import { Box, Container, Divider, Paper, Typography } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getGeoJsonBySortKey } from "./services/fetchMap.service";
import { DeleteCourse } from "./DeleteCourse";
import { SaveCourse } from "./SaveCourse";


import { ChartWrapper } from "./ChartWrapper";
import { useScreenSize } from "./helpers/screensize.helper";
// @ts-ignore
import LexicalEditorWrapper from "./text-editor/components/LexicalEditorWrapper";
import { calcTime } from "./helpers/avgPace.helper";

export const Details = () => {
  const { id } = useParams();
  const { user } = useUser();
  const [plan, setPlan] = React.useState<Plan>();
  const [coords, setCoords] = React.useState<number[][]>();
  const [properties, setProperties] = React.useState<FeatureProperties>();
  const [hoveredPoint, setHoveredPoint] = React.useState<number>(0);

  const screenSize = useScreenSize();

  let elevationWidth: number = 500;

  switch (screenSize) {
    case 'sm':
      elevationWidth = window.innerWidth - 100;
      console.log(screenSize)

      break;
    case 'md':
      elevationWidth = 500;
      console.log(screenSize)

      break;
    case 'lg':
      elevationWidth = 500;
      console.log(screenSize)

      break;
    case 'xl':
      elevationWidth = 500;
      console.log(screenSize)

      break;
    default:
      elevationWidth = 700;
      break;
  }


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
        setProperties(mapResult.features[0].properties);
      };
      fetchPlan();
    }
  }, [id, user]);

  const handleSetHoveredPoint = (x: number) => {
    if (properties) {
      setHoveredPoint(Math.floor((x / elevationWidth) * properties.pointMetadata.length))
    }
  }

  if (plan) {
    return (
      <Container sx={{ mt: '100px' }} maxWidth="xl">
        <Box
          display="flex"
          flexDirection={{ xs: "column", lg: "row" }}
          sx={{ justifyContent: "flex-start", alignItems: "flex-start" }}
          width="100%"
          gap={4}
        >
          {/* Left Side - Fixed Width */}
          <Box
            display="flex"
            flexDirection="column"
            gap={2}
            width={{ xs: "100%", lg: "520px" }}  // Full width on small, fixed on large
            sx={{
              alignSelf: "stretch",
              alignItems: { xs: "center", lg: "flex-start" },  // Center on small, left-align on large
              textAlign: { xs: "center", lg: "left" },  // Center text on small screens
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
              <Link to="/app" style={{ color: '#515B63' }}>
                <ArrowBackIcon />
              </Link>
              <Box display="flex" gap={2}>
                <DeleteCourse planId={plan.id} label={"Delete"} />
                <SaveCourse plan={plan} label={"Save"} />
              </Box>

            </Box>
            <Paper elevation={3} sx={{ padding: 4, margin: 2 }}>
              {/* Header */}
              <Typography variant="h5" gutterBottom>
                {plan.name}
              </Typography>
              <Divider sx={{ my: 2 }} />

              {/* Basic Information */}
              <Box
                display="flex"
                flexDirection={{ xs: 'column', sm: 'row' }}
                gap={2}
                sx={{ width: '100%' }}
              >
                <Box flex={1}>
                  <Typography variant="h6">Start Time:</Typography>
                  <Typography>{new Date(plan.startTime).toLocaleString()}</Typography>
                </Box>
                <Box flex={1}>
                  <Typography variant="h6">Elapsed Time:</Typography>
                  <Typography>{calcTime(plan.mileData)}</Typography>
                </Box>
                <Box flex={1}>
                  <Typography variant="h6">Grade Range:</Typography>
                  <Typography>
                    {properties?.maxGrade}% to {properties?.minGrade}%
                  </Typography>
                </Box>
              </Box>
              <Divider sx={{ my: 2 }} />

              {/* Elevation Data */}
              <Box
                display="flex"
                flexDirection={{ xs: 'column', sm: 'row' }}
                gap={2}
                sx={{ width: '100%' }}
              >
                <Box flex={1}>
                  <Typography variant="h6">Elevation Gain:</Typography>
                  <Typography>{Math.round(plan.gainInMeters * 3.28084)} feet</Typography>
                </Box>
                <Box flex={1}>
                  <Typography variant="h6">Elevation Loss:</Typography>
                  <Typography>{(Math.round(plan.lossInMeters * 3.28084))} feet</Typography>
                </Box>
                <Box flex={1}>
                  <Typography variant="h6">Total Distance:</Typography>
                  <Typography>{plan.distanceInMiles + plan.lastMileDistance} miles</Typography>
                </Box>
              </Box>
            </Paper>

            <PaceTable plan={plan} />

            {(properties && coords) && (
              <ChartWrapper
                elevationWidth={elevationWidth}
                coords={coords}
                hoveredPoint={hoveredPoint}
                handleSetHoveredPoint={handleSetHoveredPoint}
                properties={properties}
                plan={plan}
              />
            )}
          </Box>

          {/* Right Side - Flexible Lexical Editor */}
          <Box
            flex="1"
            minWidth="600px"
            sx={{ alignSelf: "stretch" }}
          >
            <LexicalEditorWrapper articleContent={plan.articleContent} />
          </Box>
        </Box>
      </Container>

    );
  } else {
    return <div></div>;
  }
};
