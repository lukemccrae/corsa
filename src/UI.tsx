import React, { useEffect, useState } from 'react';
import { Box, Grid, Card, CardContent, Typography, CardActionArea } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import { getPlanById, getPlansByUserId } from './services/fetchPlans.service';
import { useUser } from './context/UserContext';
import { Plan } from './types';
import { PaceTable } from './PaceTable';
import { DeleteCourse } from './DeleteCourse';
import { Details } from './Details';

export const UI = () => {
  const { id } = useParams();
  const { user } = useUser();
  const [selectedPlan, setSelectedPlan] = React.useState<Plan>();
  const [plans, setPlans] = React.useState<Plan[]>([]);


  useEffect(() => {
    console.log(id, user)
    if (id && user) {
      const userId = user.userId;

      const fetchPlan = async () => {
        const plans = await getPlansByUserId({ userId });
        setPlans(plans)
      }
      fetchPlan()
    }
  }, [id, user]);
  return (
    <Grid container sx={{ width: '100%', paddingTop: '64px' }}>

      {/* Left Column: Top on Large Screens, Left on Small Screens */}
      <Grid
        item
        xs={12} // Full width on small screens
        md={4}  // Takes 4/12 width on medium and larger screens
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          padding: 1,
          borderBottom: { xs: '1px solid #ddd', md: 'none' }, // Border for small screens to separate sections
          borderRight: { md: '1px solid #ddd' },
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
                <Typography variant="h6">{record.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Distance: {record.distanceInMiles + record.lastMileDistance}{ } mi
                </Typography>
              </CardContent>
            </Card>
          </CardActionArea>
        ))}
      </Grid>

      {/* Right Column: Bottom on Large Screens, Right on Small Screens */}
      <Grid
        item
        xs={12} // Full width on small screens
        md={8}  // Takes 8/12 width on medium and larger screens
        sx={{
          display: selectedPlan ? 'flex' : 'none',
          flexDirection: 'column',
          gap: 2,
          padding: 1,
          alignItems: 'center',
        }}
      >
        {/* Map Component */}
        <Box
          sx={{
            flex: 1,
            backgroundColor: '#e3e3e3',
            borderRadius: 2,
            padding: 2,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >

          {selectedPlan &&
            <div>
              <Details selectedPlan={selectedPlan} setSelectedPlan={setSelectedPlan}>
              </Details>
              <DeleteCourse
                setExpandedPlan={setSelectedPlan}
                plan={selectedPlan}
                plans={plans}
                setPlans={setPlans}
              ></DeleteCourse>
            </div>

          }
        </Box>

      </Grid>
    </Grid>
  );
};
