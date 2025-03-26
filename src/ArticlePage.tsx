import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Avatar, Box, Container, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { ArticleElement, PaceTableType, Plan , Text} from "./types";
import { useUser } from "./context/UserContext";
import { PaceTable } from "./PaceTable";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { unescapeMarkdown } from "./helpers/markdown.helper";
import { fetchPlanDetails } from "./services/anon.service";

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
        console.log(result, '<< hi')
        setPlan(result.data.getPlanById);
      }
    };
    publishedPlans();
  }, [anon, username, slug]);



  const isPaceTable = (e: ArticleElement): e is { paceTable: PaceTableType, editing: boolean } =>
    "paceTable" in e;

  const isText = (e: ArticleElement): e is { text: Text, editing: boolean } => {
    return "text" in e;
  }

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
                  {plan.articleElements.map((e: ArticleElement, index) => {

                    switch (true) {
                      case isPaceTable(e):
                        return (
                          <Box sx={{ maxWidth: "600px", marginBottom: 10 }}>
                            <PaceTable
                              cols={e.paceTable.columns}
                              miles={e.paceTable.miles}
                              backgroundColor="white"
                              plan={plan}
                            ></PaceTable>
                          </Box>
                        )
                      case isText(e):
                        console.log(e)
                        return (
                          <Box
                            sx={{
                              flex: 1,
                              display: "block",
                              padding: 2
                            }}
                          >
                            <ReactMarkdown
                              components={{
                                img: ({ node, ...props }) => <CustomImage {...props} />,
                                p: ({ node, ...props }) => (
                                  <p style={{ color: 'rgba(0, 0, 0, 0.6)', fontSize: '16px' }} {...props} />
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
                              {(unescapeMarkdown(e.text.content))}
                            </ReactMarkdown>
                          </Box>
                        )
                      default:
                        return <div></div>
                    }
                  })}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </>
      )}
    </Container>
  );
};
