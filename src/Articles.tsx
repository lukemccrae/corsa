import React from 'react';
import { Container, Grid, Typography, Card, CardContent, CardMedia, Box, CardActionArea, Stack, Avatar } from '@mui/material';
import { Tags } from './Tags';
import { Link, useParams } from 'react-router-dom';
import { Article, PartialPlan, Plan, User } from './types';
import { useUser } from './context/UserContext';
import AWS from 'aws-sdk';
import { fetchPublishedPlans } from './services/anon.service';
import { fetchUser } from './services/fetchUser.service';

export const Articles = () => {
  const [plans, setPlans] = React.useState<Plan[]>();
  const { anon, checkValidAnon } = useUser();

  React.useEffect(() => {
    const publishedPlans = async () => {
      if (anon && checkValidAnon()) {
        const result = await fetchPublishedPlans(anon)
        console.log(result)
        setPlans(result.data.getPublishedPlans)
      }
    }
    publishedPlans()
  }, [anon]);
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
          {plans && plans.map((post) => (
            <Grid item key={post.slug} xs={12} sm={6} md={4}>
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
                  to={`/${post.author}/${post.slug}`} // Replace with your route
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
                  // alt={post.title}
                  />
                  <CardContent>
                    {/* <Tags tags={post.tags}></Tags> */}
                    <Typography sx={{ margin: "10px 0 10px 0" }} variant="h6" gutterBottom>
                      {post.name}
                    </Typography>
                    {/* <Typography variant="body2" sx={{ mt: 2 }}>
                    {post.content}
                  </Typography> */}
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

