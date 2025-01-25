import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Chip, Container, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Article, FeatureCollection, FeatureProperties, Plan } from './types';
import { getPlanById } from './services/fetchPlans.service';
import { useUser } from './context/UserContext';
import { getGeoJsonBySortKey } from './services/fetchMap.service';
import { PaceTable } from './PaceTable';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm';
import { unescapeMarkdown } from './helpers/markdown.helper';
import { fetchMapDetails, fetchPlanDetails } from './services/anon.service';

export const ArticlePage = () => {
  // Extract the `id` from the URL
  const { id, user } = useParams(); // { id } corresponds to `:id` in the route path
  const [article, setArticle] = useState<Article>();
  const [plan, setPlan] = React.useState<Plan>();
  const { anon, checkValidAnon } = useUser();

  React.useEffect(() => {
    const publishedPlans = async () => {
      if (anon && checkValidAnon() && user && id) {
        const result = await fetchPlanDetails(user, id, anon)
      setPlan(result.data.getPlanById)
      }
    }
    publishedPlans()
  }, [anon]);

  const CustomImage: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = ({ alt, src, ...props }) => (
    <img
      src={src}
      alt={alt}
      style={{ maxWidth: '300px', maxHeight: '900px' }}
      {...props}
    />
  );

  return (
    <Container maxWidth="lg">
      {/* Banner Section */}
      {plan && <>
        <Box
          sx={{
            height: '400px',
            backgroundImage: `url(${plan.coverImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '8px',
            marginBottom: '20px',
            marginTop: '64px'
          }}
        >
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '8px',
              color: 'white',
              textAlign: 'center',
            }}
          >
            <Typography variant="h3" gutterBottom>
              {plan.name}
            </Typography>
          </Box>
        </Box>
        {/* Blog Post Content Section */}
        <Grid container justifyContent="center">
          <Grid size={{ xs: 8, sm: 10, md: 12 }}>
            <Box sx={{ padding: 3 }}>
              {/* Tag Section */}
              <Box sx={{ marginBottom: '20px', display: "flex", justifyContent: "center" }}>
                {article?.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    color="primary"
                    sx={{ marginRight: 1, marginBottom: 1 }}
                  />
                ))}
              </Box>

              {/* Content Section */}
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 5 }}>
                <Box sx={{ order: { xs: 2, lg: 1 }, maxWidth: "400px" }}>
                  <PaceTable cols={['Mile', 'Pace', 'Profile', 'Avg.', 'Gain', 'Elapsed']} plan={plan}></PaceTable>
                </Box>
                <Box sx={{ flex: 1, display: 'block', order: { xs: 1, lg: 2 } }}>
                  <ReactMarkdown components={{
                    img: ({ node, ...props }) => <CustomImage {...props} />,
                  }} remarkPlugins={[remarkGfm]}>
                    {unescapeMarkdown(plan.articleContent)}
                  </ReactMarkdown>
                </Box>
              </Box>

            </Box>
          </Grid>
        </Grid>
      </>
      }
    </Container>
  );
}
