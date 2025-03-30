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
}

export const ArticleEditor = (props: ArticleEditorProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [elementIdsForOrder, setElementIdsForOrder] = useState<string[] | undefined>()
  const openDialog = () => setDialogOpen(true);
  const closeDialog = () => setDialogOpen(false);

  useEffect(() => {
    setElementIdsForOrder(Object.keys(props.elements).map((e) => e))
  }, []);

  const addItem = (arg: string) => {
    let newElement: ArticleElement | undefined;
    let id = generateRandomID(4)

    switch (arg) {
      case ("text"):
        newElement = { text: { content: '"Content"' }, editing: false, id }
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
    props.createNewElementsMap((prevElements: any[]) => {
      const newElements = prevElements.map((el, idx) => {
        if (idx === index) {
          if ("text" in el) {
            return {
              ...el,
              text: {
                ...el.text,
                content,
              },
            };
          }
        }
        return el;
      });

      // Save the new elements after they are set
      const slug = props.slug;
      const userId = props.userId;
      saveArticle({ elements: newElements, slug, userId });

      return newElements; // Ensure state is actually updated
    });
  };

  const isPaceTable = (e: ArticleElement): e is { paceTable: PaceTableType, editing: boolean, id: string } =>
    "paceTable" in e;

  const isText = (e: ArticleElement): e is { text: Text, editing: boolean, id: string } => "text" in e;

  const returnProperElement = (element: ArticleElement, index: number) => {
    if (isPaceTable(element)) {
      return <Box sx={{ display: "flex", flexDirection: "row" }}>
        <PaceTableEditor element={element.paceTable} mileData={props.mileData} lastMileDistance={props.lastMileDistance}></PaceTableEditor>
      </Box>
    } else if (isText(element)) {
      return <Box sx={{ width: "100%" }}>
        {elementIdsForOrder && <TextEditor setElementIdsForOrder={setElementIdsForOrder} updateTextElement={updateTextElement} index={index} elements={props.elements} elementIdsForOrder={elementIdsForOrder} text={element.text.content}></TextEditor>}
      </Box>
    }
    return null;
  };

  return (
    <>
      {props.elements && <Stack spacing={2}>
        {elementIdsForOrder?.map((id, index) => {
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

        {/* {props.elements.map((element, index) => {
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
        })} */}
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
