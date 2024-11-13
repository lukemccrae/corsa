import React from 'react';
import { Container, Grid, Typography, Card, CardContent, CardMedia } from '@mui/material';

// Sample seed data for blog posts
const blogPosts = [
  {
    id: 1,
    title: "Exploring the Beauty of Nature",
    author: "Jane Doe",
    date: "October 20, 2024",
    image: "https://source.unsplash.com/random/800x400?nature", // Random image from Unsplash
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum vestibulum. Cras venenatis euismod malesuada."
  },
  {
    id: 2,
    title: "The Rise of AI in Everyday Life",
    author: "John Smith",
    date: "October 21, 2024",
    image: "https://source.unsplash.com/random/800x400?technology", // Random image from Unsplash
    content:
      "Aliquam fermentum, metus eget volutpat ultricies, ligula urna bibendum ipsum, nec luctus orci ligula at justo. Sed sed nulla ut tellus lobortis aliquam."
  },
  {
    id: 3,
    title: "Understanding Quantum Computing",
    author: "Alice Johnson",
    date: "October 22, 2024",
    image: "https://source.unsplash.com/random/800x400?quantum", // Random image from Unsplash
    content:
      "Phasellus a nisi non ante bibendum condimentum. Nunc sed turpis sit amet nulla placerat hendrerit. Ut accumsan consequat nulla, et convallis neque."
  },
  {
    id: 4,
    title: "The Future of Space Exploration",
    author: "Robert White",
    date: "October 23, 2024",
    image: "https://source.unsplash.com/random/800x400?space", // Random image from Unsplash
    content:
      "Sed auctor ligula ipsum, sit amet porttitor libero gravida ac. Phasellus sit amet lectus ac urna sollicitudin hendrerit in id elit."
  },
  // Additional posts can be added here
];

export const Articles = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" gutterBottom align="center">
        Latest Blog Posts
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {blogPosts.map((post) => (
          <Grid item key={post.id} xs={12} sm={6} md={3}>
            <Card sx={{ maxWidth: 345, display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="140"
                image={post.image}
                alt={post.title}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {post.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  By {post.author} | {post.date}
                </Typography>
                <Typography variant="body2" sx={{ mt: 2 }}>
                  {post.content}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};
