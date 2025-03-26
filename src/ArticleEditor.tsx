import { useState } from "react";
import { Card, CardContent, IconButton, Button, Typography, Stack, Box, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem, TextField, Checkbox } from "@mui/material";
import { ArrowUpward, ArrowDownward, Add, Edit, Delete, Save } from "@mui/icons-material";
import { ArticleElement, PaceTableType, Plan, Text } from "./types";
import { PaceTable } from "./PaceTable";
import MDEditor from "@uiw/react-md-editor";
import ReactMarkdown from "react-markdown";
import { CustomImage } from "./ArticlePage";
import { unescapeMarkdown } from "./helpers/markdown.helper";
import remarkGfm from "remark-gfm";
import { saveArticle } from "./services/saveArticle.service";

interface ArticleEditorProps {
  elements: ArticleElement[];
  setElements: Function;
  plan: Plan;
}

export const ArticleEditor = (props: ArticleEditorProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteCheck, setDeleteCheck] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [elementToEdit, setElementToEdit] = useState<any>();

  const moveItem = (index: number, direction: number) => {
    const newItems = [...props.elements ?? []];
    const targetIndex = index + direction;

    if (targetIndex < 0 || targetIndex >= newItems.length) return;

    [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
    props.setElements(newItems);
  };

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

  const toggleEditing = (index: number) => {
    props.setElements((prevElements: any[]) =>
      prevElements.map((el, idx) => {
        if (idx === index) {
          // not great but works for now to set local state
          el.text ? setElementToEdit(el.text.content) : setElementToEdit(el)
          return { ...el, editing: !el.editing }
        } else {
          return { ...el, editing: false }
        }
      }
      )
    );
  };

  const isPaceTable = (e: ArticleElement): e is { paceTable: PaceTableType, editing: boolean } =>
    "paceTable" in e;

  const isText = (e: ArticleElement): e is { text: Text, editing: boolean } => "text" in e;

  const deleteElement = (index: number) => {
    setDeleteCheck(true)
    setDeleteIndex(index)
  }

  const handleCancelDelete = () => {
    setDeleteCheck(false);
  };

  const handleSave = async (index: number) => {
    props.setElements((prevElements: any[]) =>
      prevElements.map((el, idx) => {
        if (idx === index) {
          // if text return a text object
          if (el.text) {
            return {
              text: {
                content: elementToEdit,
                type: "TEXT"
              }
            }
            // else return the el until i make pace table editable
          } else {
            return el;
          }
        } else {
          return el;
        }
      }
      )
    );
    const userId = props.plan.userId;
    const slug = props.plan.slug;
    const elements = props.elements;
    await saveArticle({ elements, slug, userId })
  }


  const handleConfirmDelete = () => {
    if (deleteIndex !== null) {
      props.setElements((prevElements: any[]) =>
        prevElements.filter((_, idx) => idx !== deleteIndex)
      );
    }
    setDeleteCheck(false); // Close the dialog after confirming
    setDeleteIndex(null); // Reset the delete index
  };

  const returnProperElement = (element: ArticleElement) => {
    if (isPaceTable(element)) {
      return <PaceTable
        cols={element.paceTable.columns}
        miles={element.paceTable.miles}
        backgroundColor="white"
        plan={props.plan}
      ></PaceTable>
    } else if (isText(element)) {
      return <Box sx={{ width: "100%" }}>
        {element.editing && elementToEdit ? (
          <Box>
            <MDEditor
              value={elementToEdit}
              onChange={(val) => {
                if (val === undefined) return;
                setElementToEdit(val)
              }}
              preview="edit"
            />
            <MDEditor.Markdown
              source={unescapeMarkdown(elementToEdit)}
              style={{ whiteSpace: "pre-wrap" }}
            />
          </Box>
        ) : (
          <ReactMarkdown
            components={{
              img: ({ node, ...props }) => <CustomImage {...props} />,
              p: ({ node, ...props }) => (
                <p style={{ color: 'rgba(0, 0, 0, 0.6)', fontSize: '16px' }} {...props} />
              ),
              h1: ({ node, ...props }) => (
                <h1 style={{ color: 'rgba(0, 0, 0, 0.6)' }} {...props} />
              ),
              h2: ({ node, ...props }) => (
                <h2 style={{ color: 'rgba(0, 0, 0, 0.6)' }} {...props} />
              ),
              h3: ({ node, ...props }) => (
                <h3 style={{ color: 'rgba(0, 0, 0, 0.6)' }} {...props} />
              ),
              ul: ({ node, ...props }) => (
                <ul style={{ color: 'rgba(0, 0, 0, 0.6)' }} {...props} />
              ),
            }}
            remarkPlugins={[remarkGfm]}
          >
            {unescapeMarkdown(element.text.content)}
          </ReactMarkdown>
        )}
      </Box>
    }
    return null;
  };

  return (
    <>
      {props.elements && <Stack spacing={2}>
        {props.elements.map((element, index) => (
          <Card key={index} sx={{ padding: 3, display: "flex" }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {returnProperElement(element)}
              </Box>
            </CardContent>
            <Stack direction="column">
              {props.elements && <div><IconButton onClick={() => moveItem(index, -1)} disabled={index === 0}>
                <ArrowUpward />
              </IconButton>
                <IconButton onClick={() => moveItem(index, 1)} disabled={index === props.elements.length - 1}>
                  <ArrowDownward />
                </IconButton>
                <IconButton onClick={() => toggleEditing(index)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => deleteElement(index)}>
                  <Delete />
                </IconButton>
                <IconButton onClick={() => handleSave(index)}>
                  <Save />
                </IconButton>
                <Dialog open={deleteCheck} onClose={handleCancelDelete}>
                  <DialogTitle>Confirm Deletion</DialogTitle>
                  <DialogContent>
                    Are you sure you want to delete this item?
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleCancelDelete} color="primary">
                      Cancel
                    </Button>
                    <Button onClick={handleConfirmDelete} color="secondary">
                      Confirm
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>}
            </Stack>
          </Card>
        ))}
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
