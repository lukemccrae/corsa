import React, { useEffect, useState } from 'react';
import { Box, Grid, Card, CardContent, Typography, CardActionArea } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import { getPlanById, getPlansByUserId } from './services/fetchPlans.service';
import { useUser } from './context/UserContext';
import { Plan } from './types';
import { PaceTable } from './PaceTable';
import { DeleteCourse } from './DeleteCourse';
import { Details } from './Details';
import { shortenName } from './helpers/substring.helper'

export const UI = () => {
  const { id } = useParams();
  const { user } = useUser();
  const [selectedPlan, setSelectedPlan] = React.useState<Plan>();
  const [plans, setPlans] = React.useState<Plan[]>([]);

  useEffect(() => {
    if (user) {
      const userId = user.userId;
      const fetchPlan = async () => {
        const plans = await getPlansByUserId({ userId });
        setPlans(plans);
      }
      fetchPlan()
    }
  }, [user]);
  return (
      <Grid
      container
        item
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          padding: 1,
          width: "50vw"
        }}
      >
        {plans.map((record, index) => (
          <CardActionArea
            key={index}
            component={Link}
            to={`/app/course/${record.id}`}
            sx={{
              '&:hover .MuiCardMedia-root': {
                filter: 'grayscale(100%)',
              },
              cursor: 'pointer',
            }}
          >
            <Card key={index} sx={{
              backgroundColor: '#f5f5f5',
              '&:hover': {
                boxShadow: 12,
              },
              marginBottom: '10px'
            }}>
              <CardContent>
                <Typography variant="h6">{shortenName(record.name)}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Distance: {record.distanceInMiles + record.lastMileDistance}{ } mi
                </Typography>
              </CardContent>
            </Card>
          </CardActionArea>
        ))}
      </Grid>
  );
};
