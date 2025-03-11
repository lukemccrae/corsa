import React from "react";
import { PaceTable } from "./PaceTable";
import { Link, useParams } from "react-router-dom";
import { useUser } from "./context/UserContext";
import { getPlanById } from "./services/fetchPlans.service";
import { FeatureProperties, Plan } from "./types";
import { Box, Container, Divider, Paper, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { DeleteCourse } from "./DeleteCourse";
import { PublishCourse } from "./PublishCourse";
import MDEditor from "@uiw/react-md-editor";

import { ChartWrapper } from "./ChartWrapper";
import { useScreenSize } from "./helpers/screensize.helper";
// @ts-ignore
import { calcTime } from "./helpers/avgPace.helper";
import { SaveArticle } from "./SaveArticle";
import { unescapeMarkdown } from "./helpers/markdown.helper";
import { Shareables } from "./Shareables";

export const Details = () => {
  const { slug } = useParams();
  const { user } = useUser();
  const [plan, setPlan] = React.useState<Plan>();
  const [coords, setCoords] = React.useState<number[][]>();
  const [properties, setProperties] = React.useState<FeatureProperties>();
  const [hoveredPoint, setHoveredPoint] = React.useState<number>(0);
  const [value, setValue] = React.useState<string>("**Hello world!!!**");

  const screenSize = useScreenSize();

  let elevationWidth: number = 500;

  switch (screenSize) {
    case "sm":
      elevationWidth = window.innerWidth - 100;
      break;
    case "md":
      elevationWidth = 500;
      break;
    case "lg":
      elevationWidth = 500;
      break;
    case "xl":
      elevationWidth = 500;
      break;
    default:
      elevationWidth = 700;
      break;
  }

  // condensedPointIndex is a way for the pace calculations to be on the same index with the elevation profile
  // elevation profile is shortened version of points so this guides indexing the map array

  React.useEffect(() => {
    if (slug && user) {
      const userId = user.preferred_username;

      const fetchPlan = async () => {
        const planResult: Plan = await getPlanById({ userId, slug });
        // this needs to retrieve the bucket key and pass it bwlow
        // const mapResult: FeatureCollection = await getGeoJsonBySortKey({ planId });
        setPlan(planResult);
        // setCoords(mapResult.features[0].geometry.coordinates);
        // setProperties(mapResult.features[0].properties);
        setValue(unescapeMarkdown(planResult.articleContent));
      };
      fetchPlan();
    }
  }, [slug, user]);

  const handleSetHoveredPoint = (x: number) => {
    if (properties) {
      setHoveredPoint(
        Math.floor((x / elevationWidth) * properties.pointMetadata.length)
      );
    }
  };

  if (plan) {
    return (
      <Container sx={{ mt: "100px" }} maxWidth="xl">
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
            width={{ xs: "100%", lg: "520px" }} // Full width on small, fixed on large
            sx={{
              alignSelf: "stretch",
              alignItems: { xs: "center", lg: "flex-start" }, // Center on small, left-align on large
              textAlign: { xs: "center", lg: "left" }, // Center text on small screens
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Link to="/app" style={{ color: "#515B63" }}>
                <ArrowBackIcon />
              </Link>
              <Box display="flex" gap={2}>
                <DeleteCourse
                  bucketKey={plan.bucketKey}
                  slug={plan.slug}
                  label={"Delete"}
                  disabled={plan.published}
                />
                {/* <PublishCourse
                  plan={plan}
                  label={plan.published ? "Unpublish" : "Publish"}
                /> */}
              </Box>
            </Box>

            <Paper>
              <Shareables plan={plan}></Shareables>
            </Paper>

            <PaceTable
              cols={[
                "Mile",
                "Pace",
                "Profile",
                "Avg.",
                "Gain",
                "GAP",
                "Loss",
                "Elapsed",
              ]}
              plan={plan}
            />

            {properties && coords && (
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

          {/* Right Side - Flexible Editor */}
          <Box
            flex="1"
            minWidth="600px"
            maxWidth="800px"
            sx={{ alignSelf: "stretch" }}
          >
            <Box
              sx={{ display: "flex", justifyContent: "end", margin: "10px" }}
            >
              <SaveArticle slug={plan.slug} label={"Save"} value={value} />
            </Box>
            <MDEditor
              value={value}
              onChange={(val) => setValue(val || "")}
              preview={"live"}
            />
            <MDEditor.Markdown
              source={value}
              style={{ whiteSpace: "pre-wrap" }}
            />
          </Box>
        </Box>
      </Container>
    );
  } else {
    return <div></div>;
  }
};
