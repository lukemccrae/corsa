import React from 'react';
import {
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Box,
  CardActionArea,
  Stack,
  Avatar,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { Plan } from './types';

export const Articles = () => {
  const [plans, setPlans] = React.useState<Partial<Plan>[]>();

  React.useEffect(() => {
    const publishedPlans = [
      {
        name: 'Desert Lung and Determination',
        coverImage: 'https://i.imgur.com/zjM1dxh.png',
        profilePhoto: 'https://i.imgur.com/ARKqkWp.png',
        author: 'colleenmiracle',
        slug: 'desert-lung-determination',
      },
      {
        name: 'Death Valley Bikepacking',
        coverImage: 'https://i.imgur.com/P6xBlp9.png',
        profilePhoto:
          'https://i.imgur.com/tdI9ZXF.png',
        author: 'lukemccrae',
        slug: 'death-valley-bikepacking',
      },
      {
        name: 'Oakland Marathon',
        coverImage: 'https://i.imgur.com/2RyYv7T.png',
        profilePhoto:
          'https://i.imgur.com/tdI9ZXF.png',
        author: 'lukemccrae',
        slug: 'oakland-marathon',
      },
      {
        name: 'Owens Valley FKT on Mt Dan',
        coverImage: 'https://i.imgur.com/yvGPLVe.png',
        profilePhoto:
          'https://i.imgur.com/tdI9ZXF.png',
        author: 'lukemccrae',
        slug: 'mt-dan-fkt',
      },
      {
        name: 'HURT 100',
        coverImage: 'https://i.imgur.com/FcwYXO8.png',
        profilePhoto:
          'https://dgalywyr863hv.cloudfront.net/pictures/athletes/35814508/10561396/6/large.jpg',
        author: 'ianpryor',
        slug: 'hurt-100',
      },
      {
        name: 'Glacier Lodge Road',
        coverImage: 'https://i.imgur.com/jHrOH9V.png',
        profilePhoto:
          'https://dgalywyr863hv.cloudfront.net/pictures/athletes/19680637/14084643/37/large.jpg',
        author: 'lukemccrae',
        slug: 'glacier-lodge-road',
      },
    ];

    setPlans(publishedPlans);
  }, []);
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
        width: '100vw',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="lg" sx={{ py: 10, justifyContent: 'center' }}>
        <Typography variant="h4" gutterBottom align="left">
          Latest Articles
        </Typography>
        <Grid container spacing={4} justifyContent="start">
          {plans &&
            plans.map(post => (
              <Grid item key={post.slug} xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    maxWidth: 545,
                    display: 'flex',
                    flexDirection: 'column',
                    '&:hover': {
                      boxShadow: 12, // Adds elevation on hover
                    },
                  }}
                >
                  <CardActionArea
                    component={Link}
                    to={`/users/${post.author}/posts/${post.slug}`} // Replace with your route
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
                      image={post.coverImage}
                    />
                    <CardContent>
                      <Typography sx={{ margin: '10px 0 10px 0' }} variant="h6" gutterBottom>
                        {post.name}
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Avatar
                          alt={post.profilePhoto}
                          src={post.profilePhoto}
                          sx={{ width: 24, height: 24 }} // Small size
                        />
                        <Typography>{post.author}</Typography>
                      </Stack>
                      <Typography
                        component="span"
                        sx={{
                          textDecoration: 'underline',
                          color: 'black',
                          cursor: 'pointer',
                          textUnderlineOffset: '8px',
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
