import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { posts } from './assets/posts'
import { Box, Chip, Container, Grid, Paper, Typography } from '@mui/material';
import { Article } from './types';

export const ArticlePage = () => {
  // Extract the `id` from the URL
  const { id } = useParams(); // { id } corresponds to `:id` in the route path
  const [article, setArticle] = useState<Article>();

  useEffect(() => {
    if(id) {
      let index = posts.map((p) => p.destination).indexOf(id);
      let post = posts[index]
      if(post) setArticle(posts[index])
    }

    // Use the `id` to fetch the article from an API or database
    // const fetchArticle = async () => {
    //   const response = await fetch(`https://api.example.com/articles/${id}`);
    //   const data = await response.json();
    //   setArticle(data);
    // };

    // fetchArticle();
  }, [id]); // Re-fetch data whenever `id` changes

//   if (!article) {
//     return <div>Loading...</div>;
//   }

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
            {article?.title}
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
            {article?.title}
          </Typography>
        </Box>

      {/* Blog Post Content Section */}
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={8} md={6}>
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
            <Typography variant="body1" paragraph>
              {article?.content}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}