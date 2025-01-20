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
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm';
import { readFileSync } from 'fs';
import { unescapeMarkdown } from './helpers/markdown.helper';

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
        console.log(plan, ' << plan')
        setCoords(mapResult.features[0].geometry.coordinates);
        setProperties(mapResult.features[0].properties)
      };
      fetchPlan();
    }

  }, [id]);

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
            {article?.name}hihi
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
          {article?.name}hihi
        </Typography>
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

            {/* Date and Author Section */}
            <Box sx={{ marginBottom: '20px' }}>
              <Typography variant="body2" color="text.secondary">
                {/* <strong>{article?.author}</strong> | {article?.date} */}
              </Typography>
            </Box>

            {/* Content Section */}
            {plan &&
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
            }
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
