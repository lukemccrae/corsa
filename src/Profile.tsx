import React from 'react';
import { Plan, User } from './types';
import { useUser } from './context/UserContext';
import { getPublishedUserInfo } from './services/anon.service';
import { Avatar, Box, Card, CardActionArea, CardContent, Container, Typography } from '@mui/material';
import { useParams, Link } from 'react-router-dom';
import { calculateStartWithTZ } from './helpers/strartTime.helper';
import { shortenName } from './helpers/substring.helper';
import { toHHMMSS } from './helpers/avgPace.helper';
import { MileProfile } from './MileProfile';
import { createMiniProfile } from './helpers/miniVertProfile.helpter';

export const Profile = () => {
  const [plans, setPlans] = React.useState<Plan[]>();
  const [userInfo, setUserInfo] = React.useState<{ bio: string, profilePicture: string }>();

  const { anon, checkValidAnon } = useUser();
  const { username } = useParams();



  React.useEffect(() => {
    const publishedPlans = async () => {
      if (anon && checkValidAnon() && username) {
        const result = await getPublishedUserInfo({ username, anon })
        const { bio, profilePicture } = result.data.getPublishedUserInfo;
        setPlans(result.data.getPublishedUserInfo.plans)
        setUserInfo({ bio, profilePicture })
      }
    }
    publishedPlans()
  }, [anon]);
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh", // Ensures full height
          maxWidth: 800,
          mx: "auto",
          mt: 8,
          p: 2,
        }}
      >
        {/* Profile Section */}
        {userInfo && (
          <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "flex-start", mb: 4, gap: 2, backgroundColor: "white", padding: "8px", transform: "scale(.98)", borderRadius: 1 }}>
            <Avatar
              src={userInfo.profilePicture}
              alt={username}
              sx={{ width: 100, height: 100, mr: 2 }}
            />
            <Box sx={{ maxWidth: "200px" }}>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                {username}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {userInfo.bio}
              </Typography>
            </Box>
          </Box>
        )}

        {/* Records Section */}
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h5">Posts</Typography> {/* Makes sure this section expands to fill remaining space */}
          {plans &&
            plans.map((record, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <CardActionArea
                  component={Link}
                  to={`/users/${username}/posts/${record.slug}`}
                  sx={{
                    "&:hover .MuiCardMedia-root": { filter: "grayscale(100%)" },
                    cursor: "pointer",
                    display: "inline-block",
                    transform: "scale(.98)",
                    transition: "transform 0.2s ease-in-out",
                    "&:hover": { transform: "scale(1)" },
                  }}
                >
                  <Card sx={{ backgroundColor: "#f5f5f5", "&:hover": { boxShadow: 6 } }}>
                    <CardContent>
                      <Typography variant="body1">{shortenName(record.name)}</Typography>
                      {/* <Typography variant="body2" color="text.secondary">
                        {calculateStartWithTZ(record.startTime, record.timezone)}
                      </Typography> */}
                      <Typography variant="body2" color="text.secondary">
                        {record.distanceInMiles + record.lastMileDistance} mi
                      </Typography>
                      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            +{Math.round(record.gainInMeters * 3.28084)} ft.
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {toHHMMSS(record.mileData.reduce((sum, item) => sum + item.pace, 0))}
                          </Typography>
                        </Box>
                        <MileProfile
                          marginRight={3}
                          mileVertProfile={createMiniProfile(record.mileData)}
                          multiplyPadding={40}
                          color={"black"}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </CardActionArea>
              </Box>
            ))}
        </Box>
      </Box>
    </Container>

  );
};

