import React from "react";
import { Link, useParams } from "react-router-dom";
import { useUser } from "./context/UserContext";
import { getPlanById } from "./services/fetchPlans.service";
import { ArticleElement, Plan } from "./types";
import { Box, Container } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { DeleteCourse } from "./DeleteCourse";
import { useScreenSize } from "./helpers/screensize.helper";
import { SaveArticle } from "./SaveArticle";
import { ArticleEditor } from "./ArticleEditor";

export const Details = () => {
  const { slug } = useParams();
  const { user } = useUser();
  const [plan, setPlan] = React.useState<Plan>();
  const [elements, setElements] = React.useState<ArticleElement[] | undefined>();

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

  React.useEffect(() => {
    if (slug && user) {
      const userId = user.preferred_username;

      const fetchPlan = async () => {
        const planResult: Plan = await getPlanById({ userId, slug });
        setPlan(planResult);
        setElements(planResult.articleElements.map(el => ({ ...el, editing: false })));
      };
      fetchPlan();
    }
  }, [slug, user]);

  if (plan) {
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
              bucketKey={plan.bucketKey}
              slug={plan.slug}
              label={"Delete"}
              disabled={plan.published}
            />
            <SaveArticle slug={plan.slug} label={"Save"} elements={elements} />
          </Box>
        </Box>

        <Box
          sx={{
            maxWidth: { xs: "100vw", sm: "600px", md: "600px" },

            mx: "auto", // Centers the content
            px: { xs: 2, sm: 3 }, // Padding for smaller screens
          }}
        >
          {elements && <ArticleEditor plan={plan} setElements={setElements} elements={elements} />}
        </Box>

      </Container>
    );
  } else {
    return <div></div>;
  }
};
