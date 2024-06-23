import * as React from "react";
import Title from "./Title";
import { handleFileUpload } from "./services/addCourse.service.ts";

import UploadProgress from "./UploadProgress.tsx";

interface AddCourseProps {
  userId: string;
  setAddCourseOpen: Function;
}
export const AddCourse = (props: AddCourseProps) => {
  const [gpx, setGpx] = React.useState<string>("");
  const [valid, setValid] = React.useState<boolean>(false);
  const [progress, setProgress] = React.useState(0);

  const handleSubmit = (event: any) => {
    event.preventDefault();
    setProgress(10)

    handleFileUpload(gpx, props.userId, setProgress, props.setAddCourseOpen);
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
    <div>
      <Title>{"Add Course"}</Title>
      {
        (
          <div>
            <input type="file" accept=".gpx" onChange={handleFileChange} />
            <button disabled={!valid} onClick={handleSubmit}>Submit</button>
            <UploadProgress progress={progress}></UploadProgress>
          </div>
        )
      }
    </div >
  );
};
