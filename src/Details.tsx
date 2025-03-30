import React from "react";
import { Link, useParams } from "react-router-dom";
import { useUser } from "./context/UserContext";
import { getPlanById } from "./services/fetchPlans.service";
import { Article, ArticleElement, MileData, Plan } from "./types";
import { Box, Container } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { DeleteCourse } from "./DeleteCourse";
import { useScreenSize } from "./helpers/screensize.helper";
import { SaveArticle } from "./SaveArticle";
import { ArticleEditor } from "./ArticleEditor";
import { ConstructionOutlined } from "@mui/icons-material";

export type ElementsMap = {
  [key: string]: ArticleElement;
};

export const Details = () => {
  const { slug } = useParams();
  const { user } = useUser();
  const [elements, setElements] = React.useState<ElementsMap>();
  const [userId, setUserId] = React.useState<string>();
  const [bucketKey, setBucketKey] = React.useState<string>();
  const [published, setPublished] = React.useState<boolean>();
  const [mileData, setMileData] = React.useState<MileData[] | undefined>();
  const [lastMileDistance, setLastMileDistance] = React.useState<number>()

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

  // use element IDs to create map for fast rendering
  const createNewElementsMap = (elements: ArticleElement[]) => {
    const elementsMap = elements.reduce<ElementsMap>((acc, element) => {
      acc[element.id] = element;  // Use `id` as the key
      return acc;
    }, {});
    return elementsMap;
  }

  React.useEffect(() => {
    if (slug && user) {
      const userId = user.preferred_username;

      const fetchPlan = async () => {
        const planResult: Plan = await getPlanById({ userId, slug });
        console.log(planResult)
        setUserId(planResult.userId)
        setElements(createNewElementsMap(planResult.articleElements))
        setBucketKey(planResult.bucketKey)
        setPublished(planResult.published)
        setMileData(planResult.mileData)
        setLastMileDistance(planResult.lastMileDistance)
      };
      fetchPlan();
    }
  }, [slug, user]);

  if (elements && userId && mileData && lastMileDistance && slug && elements && bucketKey && published !== undefined) {
    return (
      <Container sx={{ mt: "100px" }} maxWidth="lg">
        <Box sx={{
          maxWidth: { xs: "100vw", sm: "600px", md: "600px" },
          display: "flex", justifyContent: "space-between", alignItems: "center",
          margin: 2
        }}>
          <Link to="/app" style={{ color: "#515B63" }}>
            <ArrowBackIcon />
          </Link>

          <Box sx={{ display: "flex", gap: 2 }}>
            <DeleteCourse
              bucketKey={bucketKey}
              slug={slug}
              label={"Delete"}
              disabled={published}
            />
            <SaveArticle slug={slug} label={"Save"} elements={Object.values(elements)} />
          </Box>
        </Box>

        <Box
          sx={{
            maxWidth: { xs: "100vw", sm: "600px", md: "600px" },

            mx: "auto", // Centers the content
            px: { xs: 2, sm: 3 }, // Padding for smaller screens
          }}
        >
          <ArticleEditor mileData={mileData} lastMileDistance={lastMileDistance} elements={elements} createNewElementsMap={createNewElementsMap} userId={userId} slug={slug} />
        </Box>

      </Container>
    );
  } else {
    console.log(elements,userId,mileData,lastMileDistance,slug,elements,bucketKey,published)
    return <div>hi</div>;
  }
};
