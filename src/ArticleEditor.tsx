import { useState } from "react";
import { Card, CardContent, Button, Stack, Box, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { Add } from "@mui/icons-material";
import { ArticleElement, PaceTableType, Plan, Text } from "./types";
import { PaceTable } from "./PaceTable";
import { TextEditor } from "./TextEditor";
import { PaceTableEditor } from "./PaceTableEditor";

interface ArticleEditorProps {
  elements: ArticleElement[];
  setElements: Function;
  plan: Plan;
}

export const ArticleEditor = (props: ArticleEditorProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const openDialog = () => setDialogOpen(true);
  const closeDialog = () => setDialogOpen(false);

  const addItem = (arg: string) => {
    let newElement: ArticleElement | undefined;

    switch (arg) {
      case ("text"):
        newElement = { text: { content: '"Content"' }, editing: false }
        break;
      case ("paceTable"):
        newElement = { paceTable: { columns: ["Mile", "Gain", "Elapsed", "Profile", "Pace", "GAP"], miles: [-1, 4] }, editing: false }
        break;
      default:
        break;
    }
    if (newElement) {
      props.setElements([...props.elements ?? [], newElement]);
    }
    closeDialog()
  };

  const updateTextElement = (content: string, index: number) => {
    props.setElements((prevElements: any[]) =>
      prevElements.map((el, idx) => {
        if (idx === index) {
          if ("text" in el) {  // Ensure it's actually a text element
            return {
              ...el, // Preserve other properties
              text: {
                ...el.text,
                content, // Update content safely
              },
            };
          }
        }
        return el; // Return the original element unchanged
      })
    );
  };
  const isPaceTable = (e: ArticleElement): e is { paceTable: PaceTableType, editing: boolean } =>
    "paceTable" in e;

  const isText = (e: ArticleElement): e is { text: Text, editing: boolean } => "text" in e;

  const returnProperElement = (element: ArticleElement, index: number) => {
    if (isPaceTable(element)) {
      return <Box sx={{display: "flex", flexDirection: "row"}}>
        <PaceTableEditor element={element.paceTable} plan={props.plan}></PaceTableEditor>
      </Box>
    } else if (isText(element)) {
      return <Box sx={{ width: "100%" }}>
        <TextEditor updateTextElement={updateTextElement} index={index} setElements={props.setElements} id={"123"} elements={props.elements} plan={props.plan} text={element.text.content}></TextEditor>
      </Box>
    }
    return null;
  };

  return (
    <>
      {props.elements && <Stack spacing={2}>
        {props.elements.map((element, index) => {
          return (
            <Card key={index} sx={{ padding: 3, display: "flex" }}>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {returnProperElement(element, index)}
                </Box>
              </CardContent>
            </Card>
          )
        })}
        <Button variant="contained" startIcon={<Add />} onClick={openDialog}>
        </Button>
      </Stack>}
      <Dialog open={dialogOpen} onClose={closeDialog}>
        <DialogTitle>Create New Item</DialogTitle>
        <DialogContent>
          <Stack>
            <Button variant="contained" onClick={() => addItem("text")}>Create Article</Button>
            <Button variant="contained" onClick={() => addItem("paceTable")}>Create Pace Table</Button>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
