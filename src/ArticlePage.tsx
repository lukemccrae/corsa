import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Chip, Container, Paper, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Article, FeatureCollection, FeatureProperties, Plan } from './types';
import { getPlanById } from './services/fetchPlans.service';
import { useUser } from './context/UserContext';
import { getGeoJsonBySortKey } from './services/fetchMap.service';
import { PaceTable } from './PaceTable';
import { ArticleRichTextHtml } from './ArticleRichTextHtml';

export const ArticlePage = () => {
  // Extract the `id` from the URL
  const { id } = useParams(); // { id } corresponds to `:id` in the route path
  const [article, setArticle] = useState<Article>();
  const { user } = useUser();
  const [plan, setPlan] = React.useState<Plan>();
  const [coords, setCoords] = React.useState<number[][]>();
  const [properties, setProperties] = React.useState<FeatureProperties>();

  useEffect(() => {
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

  }, [id]);

return (
  <Container maxWidth="lg">
    {/* Banner Section */}
    <Box
      sx={{
        height: '400px',
        backgroundImage: `url(${article?.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: '8px',
        marginBottom: '20px',
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
          {article?.name}
        </Typography>
      </Box>
    </Box>
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'rgba(0, 0, 0, 0)',
        borderRadius: '8px',
        color: 'black',
        textAlign: 'center',
      }}
    >
      <Typography variant="h3" gutterBottom>
        {article?.name}
      </Typography>
    </Box>

    {/* Blog Post Content Section */}
    <Grid container justifyContent="center">
      <Grid size={{xs: 8, sm: 10, md: 12}}>
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

          {/* Date and Author Section */}
          <Box sx={{ marginBottom: '20px' }}>
            <Typography variant="body2" color="text.secondary">
              {/* <strong>{article?.author}</strong> | {article?.date} */}
            </Typography>
          </Box>

          {/* Content Section */}
          {plan && <ArticleRichTextHtml lexicaleditor={plan.articleContent}></ArticleRichTextHtml>}
        </Box>
        {plan && <Box>
          <PaceTable plan={plan}></PaceTable>
        </Box>}
      </Grid>
    </Grid>
  </Container>
);
}
