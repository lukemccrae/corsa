import React from 'react';
import { Container, Grid, Typography, Card, CardContent, CardMedia, Box, CardActionArea } from '@mui/material';
import { posts } from './assets/posts'
import { Tags } from './Tags';
import { Link } from 'react-router-dom';
import { Article } from './types';


export const Articles = () => {
  return (
    <Box
        component="main"
        sx={{
            // backgroundImage: `url('../splash.min.jpg');`,
            flexGrow: 1,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed", /* This keeps the background image fixed while scrolling */
            backgroundRepeat: "no-repeat",
            height: "100vh",
            overflow: "auto",
            width: '100vw',
            justifyContent: "center"
        }}
    >
      <Container maxWidth="lg" sx={{ py: 10, justifyContent: "center" }}>
        <Typography variant="h4" gutterBottom align="left">
          Latest Articles
        </Typography>
        <Grid container spacing={4} justifyContent="start">
          {posts.map((post) => (
            <Grid item key={post.id} xs={12} sm={6} md={4}>
              <Card sx={{ 
                  maxWidth: 545, 
                  display: 'flex', 
                  flexDirection: 'column',
                  '&:hover': {
                    boxShadow: 12, // Adds elevation on hover
                  }
                }}>
                  <CardActionArea
                  component={Link}
                  to={`/article/${post.id}`} // Replace with your route
                  sx={{
                    '&:hover .MuiCardMedia-root': {
                      filter: 'grayscale(100%)', // Grayscale effect
                    },
                    cursor: 'pointer', // Ensures the pointer cursor
                  }}
                >
                <CardMedia
                  component="img"
                  height="140"
                  image={post.image}
                  alt={post.title}
                />
                <CardContent>
                  <Tags tags={post.tags}></Tags>
                  <Typography sx={{margin: "10px 0 10px 0"}} variant="h6" gutterBottom>
                    {post.title}
                  </Typography>
                  {/* <Typography variant="body2" sx={{ mt: 2 }}>
                    {post.content}
                  </Typography> */}
                  <Typography
                    component="span"
                    sx={{
                      textDecoration: 'underline',
                      color: 'black',
                      cursor: 'pointer',
                      textUnderlineOffset:'8px',
                      fontWeight: 'bold',
                    }}
                  >
                    READ
                  </Typography>
                </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>

  );
};

