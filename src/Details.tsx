import React from "react";
import { PaceTable } from "./PaceTable";
import { Link, useParams } from "react-router-dom";
import { useUser } from "./context/UserContext";
import { getPlanById } from "./services/fetchPlans.service";
import { FeatureCollection, FeatureProperties, Plan } from "./types";
import { Box, Container, useMediaQuery, useTheme } from "@mui/material";
import Grid from '@mui/material/Grid2';
import { MapComponent } from "./MapComponent";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getGeoJsonBySortKey } from "./services/fetchMap.service";
import { DeleteCourse } from "./DeleteCourse";


import { ChartWrapper } from "./ChartWrapper";
import { useScreenSize } from "./helpers/screensize.helper";
// @ts-ignore
import LexicalEditorWrapper from "./text-editor/components/LexicalEditorWrapper";

export const Details = () => {
  const { id } = useParams();
  const { user } = useUser();
  const [plan, setPlan] = React.useState<Plan>();
  const [coords, setCoords] = React.useState<number[][]>();
  const [properties, setProperties] = React.useState<FeatureProperties>();
  const [hoveredPoint, setHoveredPoint] = React.useState<number>(0);

  const screenSize = useScreenSize();

  let elevationWidth: number;

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
      elevationWidth = 700;
      console.log(screenSize)

      break;
    case 'xl':
      elevationWidth = 700;
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
        setProperties(mapResult.features[0].properties)
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
      <Container sx={{ mt: '64px' }}>
        <Box
          display="flex"
          flexDirection={{ xs: "column", md: "column", lg: "column", xl: "row" }}  // Responsive direction
          sx={{ justifyContent: "space-between" }}
          width="100%"
          gap={10}
        >
          {/* Left Side - Smaller Column */}
          <Box
            display="flex"
            flexDirection="column"
            gap={2}
            flex={{ xs: "1 1 100%", md: "1 1 100%", lg: "1 1 100%", xl: "1 1 25%" }} 
            maxWidth={{ md: "730px" }}                // Limit max width
          >
            <Link to="/app" style={{ color: '#515B63' }}>
              <ArrowBackIcon />
            </Link>

            <DeleteCourse planId={plan.id} label={"Delete"} />

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

          {/* Right Side - Wider Lexical Editor */}
          <Box
            flex={{ xs: "1 1 100%", md: "1 1 100%", lg: "1 1 100%", xl: "1 1 75%" }}  // Occupies more space
            minWidth={{ md: "600px" }}               // Set minimum width for editor
          >
            <LexicalEditorWrapper />
          </Box>
        </Box>
      </Container>

    );
  } else {
    return <div></div>;
  }
};
