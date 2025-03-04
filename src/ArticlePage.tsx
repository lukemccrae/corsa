import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Avatar, Box, Container, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Plan } from "./types";
import { useUser } from "./context/UserContext";
import { PaceTable } from "./PaceTable";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { unescapeMarkdown } from "./helpers/markdown.helper";
import { fetchPlanDetails } from "./services/anon.service";

export const ArticlePage = () => {
  // Extract the `id` from the URL
  const { id, username } = useParams(); // { id } corresponds to `:id` in the route path
  const [plan, setPlan] = React.useState<Plan>();
  const { anon, checkValidAnon } = useUser();

  React.useEffect(() => {
    const publishedPlans = async () => {
      if (anon && checkValidAnon() && username && id) {
        const result = await fetchPlanDetails(username, id, anon);
        setPlan(result.data.getPlanById);
      }
    };
    publishedPlans();
  }, [anon, username, id]);

  const CustomImage: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = ({
    alt,
    src,
    ...props
  }) => (
    <img
      src={src}
      alt={alt}
      style={{ maxWidth: "400px", width: "100%", height: "auto" }}
      {...props}
    />
  );

  return (
    <Container maxWidth="md">
      {/* Banner Section */}
      {plan && (
        <>
          <Box
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
          </Box>
          {/* Blog Post Content Section */}
          <Stack
            direction="column"
            spacing={1}
            alignItems="center"
            sx={{
              marginBottom: 2,
              marginTop: 1,
              color: "gray.700",
              fontSize: "0.875rem", // Slightly smaller text
            }}
          >
            <Avatar
              alt={plan.author}
              src={plan.profilePhoto}
              sx={{ width: 64, height: 64 }} // Slightly larger size for better readability
            />
            <Box>
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

              <Typography>
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
                  <Box
                    sx={{
                      flex: 1,
                      display: "block",
                      // order: { xs: 1, lg: 2 }, // pace chart always on bottom
                      padding: 2
                    }}
                  >
                    <ReactMarkdown
                      components={{
                        img: ({ node, ...props }) => <CustomImage {...props} />,
                        p: ({ node, ...props }) => (
                          <p style={{ color: 'rgba(0, 0, 0, 0.6)' }} {...props} />
                        ),
                        h1: ({ node, ...props }) => (
                          <h1 style={{ color: 'rgba(0, 0, 0, 0.6)' }} {...props} />
                        ),
                        h2: ({ node, ...props }) => (
                          <h2 style={{ color: 'rgba(0, 0, 0, 0.6)' }} {...props} />
                        ),
                        h3: ({ node, ...props }) => (
                          <h3 style={{ color: 'rgba(0, 0, 0, 0.6)' }} {...props} />
                        ),
                        ul: ({ node, ...props }) => (
                          <ul style={{ color: 'rgba(0, 0, 0, 0.6)' }} {...props} />
                        ),
                      }}
                      remarkPlugins={[remarkGfm]}
                    >
                      {unescapeMarkdown(plan.articleContent)}
                    </ReactMarkdown>
                  </Box>
                  <Box sx={{ order: { xs: 2, lg: 1 }, maxWidth: "600px", marginBottom: 10 }}>
                    <PaceTable
                      cols={[
                        "Mile",
                        "Pace",
                        "Profile",
                        "Avg.",
                        "Gain",
                        "GAP",
                        "Elapsed",
                      ]}
                      plan={plan}
                    ></PaceTable>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </>
      )}
    </Container>
  );
};
