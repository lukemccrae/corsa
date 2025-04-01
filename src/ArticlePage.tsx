import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Avatar, Box, Container, Stack, Typography, Link as WebLink } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { ArticleElement, PaceTableType, Plan, Text } from "./types";
import { useUser } from "./context/UserContext";
import { PaceTable } from "./PaceTable";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { unescapeMarkdown } from "./helpers/markdown.helper";
import { fetchPlanDetails } from "./services/anon.service";
import { TitleBox } from "./TitleBox";

export const CustomImage: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = ({
  alt,
  src,
  ...props
}) => (
  <img
    src={src}
    alt={alt}
    style={{ maxWidth: "600px", width: "100%", height: "auto" }}
    {...props}
  />
);

export const ArticlePage = () => {
  // Extract the `id` from the URL
  const { slug, username } = useParams();
  const [plan, setPlan] = React.useState<Plan>();
  const { anon, checkValidAnon } = useUser();

  React.useEffect(() => {
    const publishedPlans = async () => {
      if (anon && checkValidAnon() && username && slug) {
        const result = await fetchPlanDetails(username, slug, anon);
        setPlan(result.data.getPlanById);
      }
    };
    publishedPlans();
  }, [anon, username, slug]);



  const isPaceTable = (e: ArticleElement): e is { paceTable: PaceTableType, editing: boolean, id: string } =>
    "paceTable" in e;

  const isText = (e: ArticleElement): e is { text: Text, editing: boolean, id: string } => {
    return "text" in e;
  }

  return (
    <Container maxWidth="md">
      {/* Banner Section */}
      {plan && (
        <>
          {/* <Box
            sx={{
              height: "400px",
              backgroundImage: `url(${plan.coverImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderRadius: "8px",
              marginBottom: "20px",
              marginTop: "64px",
            }}
          >
            <Box
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                background: "rgba(0, 0, 0, 0.3)",
                borderRadius: "8px",
                color: "white",
                textAlign: "center",
              }}
            >
              <Typography
                sx={{
                  typography: {
                    xs: "h4",
                    sm: "h2",
                  },
                }}
                gutterBottom
              >
                {plan.name}
              </Typography>
            </Box>
          </Box> */}
          {/* Blog Post Content Section */}
          {/* <TitleBox plan={plan}></TitleBox> */}
          <Box sx={{ marginTop: "90px", width: "80%" }}>
            <Typography sx={{ color: "black" }} variant="h4">{plan.name}</Typography>
            <Stack direction="row">
              <Avatar
                alt={plan.author}
                src={plan.profilePhoto}
                sx={{ width: 64, height: 64 }} // Slightly larger size for better readability
              />
              <Box sx={{ margin: 1 }}>
                <Typography
                  to={`/users/${plan.author}`}
                  component={Link}
                  sx={{
                    color: "black",
                    textDecoration: "underline",
                    "&:hover": {
                      color: "#E3A446",
                      textDecoration: "underline",
                      textDecorationColor: "#E3A446",
                    },
                  }}
                  variant="body1"
                >
                  <strong>{plan.author}</strong>
                </Typography>

                <Typography sx={{ color: "black" }}>
                  {new Date(Number(plan.publishDate)).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }
                  )}
                </Typography>
              </Box>
            </Stack>

          </Box>

          <Grid container justifyContent="center">
            <Grid size={{ xs: 10, sm: 12, md: 12 }}>
              <Box sx={{ padding: 1 }}>
                {/* Tag Section */}
                <Box
                  sx={{
                    marginBottom: "20px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                ></Box>

                {/* Content Section */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", lg: "column" }, // pace chart always on bottom
                    gap: 3,
                  }}
                >
                  {plan.articleElements.map((e: ArticleElement, index) => {

                    switch (true) {
                      case isPaceTable(e):
                        return (
                          <Box sx={{ maxWidth: "600px", marginBottom: 10 }}>
                            <PaceTable
                              cols={e.paceTable.columns}
                              miles={e.paceTable.miles}
                              plan={plan}
                            ></PaceTable>
                          </Box>
                        )
                      case isText(e):
                        return (
                          <Box
                            sx={{
                              flex: 1,
                              display: "block",
                              padding: 2,
                              color: "black",
                              width: "500px"
                            }}
                          >
                            <div dangerouslySetInnerHTML={{ __html: e.text.content }}></div>
                          </Box>
                        )
                      default:
                        return <div></div>
                    }
                  })}

                  <Typography sx={{width: "500px",  fontStyle: "italic" }} color="black">
                    Corsa is a platform for athletes to share their journey through writing, blending performance tracking with storytelling. Currently in beta, we’re looking for passionate creators to join and shape the future. Fill out the{' '}
                    <WebLink
                      href="https://docs.google.com/forms/d/e/1FAIpQLSeC3yoPVanzaJmeqYOXzIlaYuQnSyezupV5BO4NfEMMBLlCXw/viewform"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      form here
                    </WebLink> to get a creator invite.
                  </Typography>

                </Box>
              </Box>
            </Grid>
          </Grid>
        </>
      )}
    </Container>
  );
};
