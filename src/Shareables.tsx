import { Avatar, Box, TextField, Typography } from '@mui/material';
import React, { useRef } from 'react';
import { MileProfile } from './MileProfile';
import { createMiniProfile } from './helpers/miniVertProfile.helpter';
import { MileData } from './types';
import { averagePaces, toHHMMSS } from './helpers/avgPace.helper';
import { Logo } from './Logo';
import { getRandomColor } from './helpers/randomColor.helper';
import { ElementsMap } from './Details';
import html2canvas from 'html2canvas';

interface ShareablesProps {
  elements: ElementsMap;
  profilePhoto: string;
  planName: string;
  mileData: MileData[];
  lastMileDistance: number;
  author: string;
  activityType: string;
}

export const Shareables = (props: ShareablesProps) => {
  const [value, setValue] = React.useState('');
  const titleRef = useRef<HTMLDivElement | null>();
  const customRef = useRef<HTMLDivElement | null>();

  const { bg, text } = getRandomColor();

  const captureImage = async (ref: any) => {
    const element = ref;
    if (element) {
      const canvas = await html2canvas(element.current as HTMLElement, { useCORS: true });
      const imgData = canvas.toDataURL('image/png');

      const link = document.createElement('a');
      link.href = imgData;
      link.download = `screenshot.png`;
      link.click();
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      {/* data box */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {/* Data Box */}
        <Box
          ref={titleRef}
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            backgroundColor: bg,
            margin: 1,
            p: 5,
            position: 'relative',
            color: text,
            height: '625px',
            width: '500px',
            justifyContent: 'space-between', // Ensures the content is spaced out
          }}
        >
          <Typography variant="h2" sx={{ color: text }}>
            {props.planName}
          </Typography>
          <Box>
            <MileProfile
              marginRight={5}
              mileVertProfile={createMiniProfile(props.mileData, 70)}
              multiplyPadding={150}
              color={text}
            />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, paddingTop: 2 }}>
            {/* Data rows */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="body1" fontWeight="bold" color={text}>
                  {props.mileData.length + props.lastMileDistance} mi
                </Typography>
                <Typography variant="body1" fontWeight="bold" color={text}>
                  +
                  {Math.round(
                    props.mileData.reduce((total, md) => total + md.elevationGain, 0) * 3.28084
                  ).toLocaleString()}{' '}
                  ft
                </Typography>
                <Typography
                  sx={{ display: props.activityType == 'RUN' ? 'flex' : 'none' }}
                  variant="body1"
                  fontWeight="bold"
                  color={text}
                >
                  {averagePaces(props.mileData, props.lastMileDistance, true)} /mi
                </Typography>
                <Typography variant="body1" fontWeight="bold" color={text}>
                  {toHHMMSS(props.mileData.reduce((sum, item) => sum + item.pace, 0))}
                </Typography>
              </Box>
            </Box>
            {/* Row with Avatar, Username, and Logo */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {/* Avatar and Username */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar src={props.profilePhoto} style={{ width: 64, height: 64 }} />
                <Typography variant="h6">{props.author}</Typography>
              </Box>
              <Logo color={'#e3a446'} activityType={props.activityType} />
            </Box>
          </Box>
        </Box>
        <button onClick={() => captureImage(titleRef)} style={{ marginTop: 10 }}>
          Capture Image
        </button>
      </Box>

      <Box>
        <Box
          ref={customRef}
          sx={{
            position: 'relative',
            height: '625px',
            width: '500px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: bg,
            color: text,
            margin: 2,
            p: 5,
          }}
        >
          {/* Centered Text */}
          <Typography variant="h4" sx={{ textAlign: 'left', paddingRight: 5 }}>
            "{value}"
          </Typography>

          {/* Logo in Top Right */}
          <Box
            sx={{
              position: 'absolute',
              top: 36,
              left: 36,
            }}
          >
            <Avatar src={props.profilePhoto} sx={{ width: 80, height: 80 }} />
          </Box>

          {/* Name & Profile Photo Bottom Right */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 48,
              right: 48,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Logo color={'#e3a446'} activityType={props.activityType}></Logo>
          </Box>
        </Box>
        <button onClick={() => captureImage(customRef)} style={{ marginTop: 10 }}>
          Capture Image
        </button>
        <TextField
          sx={{ margin: '20px 0 50px 0' }}
          label="Enter text"
          variant="outlined"
          value={value}
          onChange={e => setValue(e.target.value)}
          fullWidth
        />
      </Box>
    </Box>
  );
};
