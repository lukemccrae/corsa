import * as React from "react";
import Title from "./Title";
import { handleFileUpload } from "./services/addCourse.service.ts";
import { useUser } from './context/UserContext';
import { useNavigate, useParams } from 'react-router-dom';


import UploadProgress from "./UploadProgress.tsx";
import { Box, Button, Card, Typography } from "@mui/material";

export const AddCourse = () => {
  const { user } = useUser()

  const [gpx, setGpx] = React.useState<string>("");
  const [valid, setValid] = React.useState<boolean>(false);
  const [progress, setProgress] = React.useState(0);
  const navigate = useNavigate();


  const handleSubmit = (event: any) => {
    event.preventDefault();
    setProgress(10)

    if (user) {
      handleFileUpload(gpx, user.userId, setProgress, navigate, user.preferred_username);
    } else {
      alert('There is a problem with your login, please relog then try again.')
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const contents = e.target?.result as string;
        if (contents) {
          // need to validate that there are timestamps in the GPX
          // cant do this on the backend since the flow is to upload straight to S3
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(contents, "application/xml");

          // Check for parse errors
          if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
            console.error("Error parsing XML");
            return false;
          }

          const timeElements = xmlDoc.getElementsByTagName("time");
          if (timeElements.length > 0) {
            setValid(true)
            setGpx(contents);
            
          } else {
            setValid(false)
            alert("GPX timestamps are required")
            setGpx("")
          }

        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        borderRadius: 2,
        boxShadow: 3,
        backgroundColor: 'background.paper',
        width: '100%',
        maxWidth: 500, // Make the form more compact
        margin: 'auto',
      }}
    >
      <Typography variant="h4" sx={{ marginBottom: 2, color: 'black' }}>
        Add Course
      </Typography>
      <Box sx={{display: 'flex', color: 'black'}}>
        <input type="file" accept=".gpx" onChange={handleFileChange} style={{ marginBottom: '16px' }} />
      </Box>

      <Button
        disabled={!valid}
        onClick={handleSubmit}
        sx={{
          backgroundColor: 'primary.main',
          color: 'white',
          padding: '10px 10px 10px 10px',
          '&:hover': {
            backgroundColor: 'primary.dark',
          },
        }}
      >
        Submit
      </Button>

      <UploadProgress progress={progress} />
    </Box>
  );
};
