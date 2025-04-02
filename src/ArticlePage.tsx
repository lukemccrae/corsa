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
    <Container maxWidth="sm">
      {plan && (
        <>
          <Box sx={{ marginTop: "80px" }}>
            <Typography sx={{ color: "black", margin: 3 }} variant="h4">
              {plan.name}
            </Typography>
            <Stack direction="row" sx={{ margin: "0 0 0 30px" }}>
              <Avatar
                alt={plan.author}
                src={plan.profilePhoto}
                sx={{ width: 64, height: 64 }}
              />
              <Box sx={{ margin: 2 }}>
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

                <Typography sx={{ color: "black", fontSize: "12px" }}>
                  {new Date(Number(plan.publishDate)).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </Typography>
              </Box>
            </Stack>
          </Box>
          {/* Content Section */}

          {plan.articleElements.map((e: ArticleElement, index) => {
            switch (true) {
              case isPaceTable(e):
                return (
                  <Box
                    key={index}
                    sx={{
                      margin: "20px 0", // Spacing around the pace table
                      width: "100%", // Ensure it takes full width of the container
                      overflowX: "auto", // Allow horizontal scrolling if needed
                    }}
                  >
                    <PaceTable
                      cols={e.paceTable.columns}
                      miles={e.paceTable.miles}
                      plan={plan}
                    />
                  </Box>
                );
              case isText(e):
                return (
                  <Box>
                    <Typography
                      variant="body1"
                      sx={{
                        // Responsive width for the text block, fallback to 100% on small screens
                        width: {
                          xs: "80vw", // Full width on small screens
                          sm: "480px", // 70% of the viewport width on medium and larger screens
                        },
                        wordWrap: "break-word",
                        overflowWrap: "break-word",
                        wordBreak: "break-word",
                        whiteSpace: "normal",
                        color: "black",
                        margin: "0 20px 0 20px"
                      }}
                      dangerouslySetInnerHTML={{
                        __html: `<style>
                          img {
                            max-width: 100% !important; 
                            height: auto;
                          }
                        </style>${e.text.content}`
                      }}
                    />
                  </Box>
                );
              default:
                return <div key={index}></div>;
            }
          })}

          <Typography
            sx={{
              width: "100%",
              fontStyle: "italic",
              wordWrap: "break-word",
              overflowWrap: "break-word",
              wordBreak: "break-word",
              whiteSpace: "normal",
            }}
            color="black"
          >
            Corsa is a platform for athletes to share their journey through writing, blending performance tracking with storytelling. Currently in beta, we’re looking for passionate creators to join and shape the future. Fill out the{' '}
            <WebLink
              href="https://docs.google.com/forms/d/e/1FAIpQLSeC3yoPVanzaJmeqYOXzIlaYuQnSyezupV5BO4NfEMMBLlCXw/viewform"
              target="_blank"
              rel="noopener noreferrer"
            >
              form here
            </WebLink>{' '}
            to get a creator invite.
          </Typography>
        </>
      )}
    </Container>
  );
};
