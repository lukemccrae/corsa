import React, { useEffect, useState } from 'react';
import { Grid, Card, CardContent, Typography, CardActionArea, Box, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import { getPlansByUserId } from './services/fetchPlans.service';
import { useUser } from './context/UserContext';
import { Plan } from './types';
import { shortenName } from './helpers/substring.helper'
import { MileProfile } from './MileProfile';
import { createMiniProfile } from './helpers/miniVertProfile.helpter';
import { toHHMMSS } from './helpers/avgPace.helper';

export const UI = () => {
  const { user } = useUser();
  const [plans, setPlans] = React.useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchPlan = async () => {
        setLoading(true)
        const plans = await getPlansByUserId({ user });
        setLoading(false)
        console.log(plans)
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
        flexDirection: 'row',
        gap: 0,
        padding: 0,
        // width: "100vw"
      }}
    > {loading ? <Box sx={{ display: 'flex', marginTop: "100px" }}>
      <CircularProgress />
    </Box> : <></>}
      {plans.map((record, index) => (
        <Box key={index}>
          <CardActionArea
            key={index}
            component={Link}
            to={`/app/course/${record.slug}`}
            sx={{
              '&:hover .MuiCardMedia-root': {
                filter: 'grayscale(100%)',
              },
              cursor: 'pointer',
              display: 'inline-block',
              marginBottom: '10px',
              mx: '2px',
              transform: 'scale(.92)',

            }}
          >
            <Card
              key={index}
              sx={{
                backgroundColor: '#f5f5f5',
                '&:hover': {
                  boxShadow: 12,
                }
              }}>
              <CardContent>
                <Typography>{shortenName(record.name)}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {record.distanceInMiles + record.lastMileDistance}{ } mi
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      +{Math.round(record.mileData.reduce((total, md) => total + md.elevationGain, 0) * 3.28084)} ft.                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {toHHMMSS(record.mileData.reduce((sum, item) => sum + item.pace, 0))}
                    </Typography>
                  </Box>
                  <MileProfile marginRight={3} mileVertProfile={createMiniProfile(record.mileData, 20)} multiplyPadding={40} color={'black'} />
                </Box>
              </CardContent>
            </Card>
          </CardActionArea>
        </Box>
      ))}
    </Grid>
  );
};
