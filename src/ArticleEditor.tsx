import { useState, useEffect } from "react";
import { Card, CardContent, Button, Stack, Box, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { Add } from "@mui/icons-material";
import { ArticleElement, MileData, PaceTableType, Plan, Text } from "./types";
import { PaceTable } from "./PaceTable";
import { TextEditor } from "./TextEditor";
import { PaceTableEditor } from "./PaceTableEditor";
import { saveArticle } from "./services/saveArticle.service";
import { generateRandomID } from "./helpers/randomId.helper";
import { ElementsMap } from "./Details";

interface ArticleEditorProps {
  userId: string;
  slug: string;
  elements: ElementsMap;
  createNewElementsMap: Function;
  lastMileDistance: number;
  mileData: MileData[]
  elementIdsForOrder: string[];
  setElementIdsForOrder: Function;
  activityType: string;
}

export const ArticleEditor = (props: ArticleEditorProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const openDialog = () => setDialogOpen(true);
  const closeDialog = () => setDialogOpen(false);

  const addItem = (arg: string) => {
    let newElement: ArticleElement | undefined;
    let id = generateRandomID(4)

    switch (arg) {
      case ("text"):
        newElement = { text: { content: 'New Text' }, editing: false, id }
        break;
      case ("paceTable"):
        newElement = { paceTable: { columns: ["Mile", "Gain", "Elapsed", "Profile", "Pace", "GAP"], miles: [-1, 4] }, editing: false, id }
        break;
      default:
        break;
    }
    if (newElement) {
      props.createNewElementsMap([...Object.values(props.elements), newElement])
    }
    closeDialog()
  };


  const updateTextElement = async (content: string, index: number) => {
    let prevElementsArray = Object.values(props.elements);

    // Type guard to check if it's a text element
    if ("text" in prevElementsArray[index]) {
      prevElementsArray[index].text.content = content;
    } else {
      console.error("Element at index is not a text element");
    }
    props.createNewElementsMap(prevElementsArray)
  };

  const updatePaceTableElement = async (miles: number[], columns: string[], index: number) => {
    let prevElementsArray = Object.values(props.elements);

    // Type guard to check if it's a text element
    if ("paceTable" in prevElementsArray[index]) {
      prevElementsArray[index].paceTable.columns = columns;
      prevElementsArray[index].paceTable.miles = miles;
    } else {
      console.error("Element at index is not a pace table");
    }
    props.createNewElementsMap(prevElementsArray)
  };

  const isPaceTable = (e: ArticleElement): e is { paceTable: PaceTableType, editing: boolean, id: string } =>
    "paceTable" in e;

  const isText = (e: ArticleElement): e is { text: Text, editing: boolean, id: string } => "text" in e;

  const returnProperElement = (element: ArticleElement, index: number) => {
    if (isPaceTable(element)) {
      return <Box sx={{ display: "flex", flexDirection: "row" }}>
        <PaceTableEditor activityType={props.activityType} updatePaceTableElement={updatePaceTableElement} element={element.paceTable} mileData={props.mileData} lastMileDistance={props.lastMileDistance} index={index} elements={{}} createNewElementsMap={props.createNewElementsMap} setElementIdsForOrder={props.setElementIdsForOrder} elementIdsForOrder={props.elementIdsForOrder}></PaceTableEditor>
      </Box>
    } else if (isText(element)) {
      return <Box sx={{ width: "100%" }}>
        {props.elementIdsForOrder && <TextEditor setElementIdsForOrder={props.setElementIdsForOrder} updateTextElement={updateTextElement} index={index} elements={props.elements} elementIdsForOrder={props.elementIdsForOrder} text={element.text.content}></TextEditor>}
      </Box>
    }
    return null;
  };

  return (
    <>
      {props.elements && <Stack spacing={2}>
        {props.elementIdsForOrder?.map((id, index) => {
          return <Card key={id} sx={{ padding: 3, display: "flex" }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {returnProperElement(props.elements[id], index)}
              </Box>
            </CardContent>
          </Card>
        })}
        <Button sx={{ margin: 2 }} variant="contained" startIcon={<Add />} onClick={openDialog}>
        </Button>
        <Box sx={{margin: "5px"}}></Box>
      </Stack>}
      <Dialog open={dialogOpen} onClose={closeDialog}>
        <DialogTitle>Create New Item</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
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
