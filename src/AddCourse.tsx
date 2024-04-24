import * as React from "react";
import Title from "./Title";
import { handleFileUpload } from "./services/addCourse.service.ts";

import MinHeightTextarea from "./textArea";

interface AddCourseProps {
  userId: string;
}
export const AddCourse = (props: AddCourseProps) => {
  const [showFileUpload, setShowFileUpload] = React.useState(false);
  const [gpx, setGpx] = React.useState<string>("");

  React.useEffect(() => {}, []);

  const handleSubmit = (event: any) => {
    event.preventDefault();

    handleFileUpload(gpx, props.userId);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const contents = e.target?.result as string;
        if (contents) {
          setGpx(contents);
          console.log(contents, "<< contents");
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div>
      <Title>{"Add Course"}</Title>
      {showFileUpload ? (
        <div>
          <input type="file" accept=".gpx" onChange={handleFileChange} />
          <span
            style={{
              color: "blue",
              textDecoration: "underline",
              cursor: "pointer",
              display: "block",
              fontSize: "12px",
            }}
            onClick={() => setShowFileUpload(false)}
          >
            Text input
          </span>
          <button onClick={handleSubmit}>Submit</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <MinHeightTextarea gpx={gpx} setGpx={setGpx}></MinHeightTextarea>
          <span
            style={{
              color: "blue",
              textDecoration: "underline",
              cursor: "pointer",
              fontSize: "12px",
              display: "flex",
              justifyContent: "flex-end",
            }}
            onClick={() => setShowFileUpload(true)}
          >
            File input
          </span>
          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
};
