import { ArrowDownward, ArrowUpward, Delete, Edit, Save } from "@mui/icons-material";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack } from "@mui/material"
import { Editor } from "@tinymce/tinymce-react"
import { useEffect, useState } from "react";
import { saveArticle } from "./services/saveArticle.service";
import { ArticleElement, Plan } from "./types";
import DOMPurify from 'dompurify';

interface TextEditorProps {
    text: string;
    plan: Plan;
    elements: ArticleElement[];
    index: number;
    setElements: Function;
    id: string;
    updateTextElement: Function;
}

export const TextEditor = (props: TextEditorProps) => {
    const [editing, setEditing] = useState(false);
    const [deleteCheck, setDeleteCheck] = useState(false);
    const [newText, setNewText] = useState<string>("")

    useEffect(() => {
        setNewText(DOMPurify.sanitize(props.text))
    }, [])


    const moveItem = (index: number, direction: number) => {
        // props.setIdOrder(newItems);
    };


    const deleteElement = () => {
        setDeleteCheck(true)
    }

    const handleCancelDelete = () => {
        setDeleteCheck(false);
    };

    const handleSave = async () => {
        props.updateTextElement(newText, props.index)
        setEditing(false)
    }

    const handleConfirmDelete = () => {
        // remove id from list
    };

    const handleEditorChange = (text: any) => {
        // need to test this with XSS examples =P
        const sanitizedContent = DOMPurify.sanitize(text.lastLevel.content);
        setNewText(sanitizedContent);
    }

    return <Box sx={{ display: "flex", flexDirection: "row" }}>
        {editing ? <Editor
            apiKey='lc1hsudemo0gx33vhn59zisxgvcp3fktuvifbvk6xnrt7jbh'
            init={{
                selector: '#tinymce',
                branding: false,
                width: 480,
                plugins: [
                    // Core editing features
                    'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks',
                    // Your account includes a free trial of TinyMCE premium features
                    // Try the most popular premium features until Apr 9, 2025:
                    // 'checklist', 'mediaembed', 'casechange', 'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste', 'advtable', 'advcode', 'editimage', 'advtemplate', 'ai', 'mentions', 'tinycomments', 'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 'typography', 'inlinecss', 'markdown', 'importword', 'exportword', 'exportpdf'
                ],
                menubar: "edit insert view format tools table help", // Removed "file"
                toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                tinycomments_mode: 'embedded',
                tinycomments_author: 'Author name',
                mergetags_list: [
                    { value: 'First.Name', title: 'First Name' },
                    { value: 'Email', title: 'Email' },
                ],
                // ai_request: (request, respondWith) => respondWith.string(() => Promise.reject('See docs to implement AI Assistant')),
            }}
            initialValue={DOMPurify.sanitize(props.text)}
            onChange={handleEditorChange}
        /> : <div>{props.text}</div>}
        <Stack direction="column">
            <IconButton onClick={() => setEditing(!editing)}>
                <Edit />
            </IconButton>
            <IconButton sx={{ display: editing ? "inline-flex" : "none" }} onClick={() => moveItem(props.index, -1)} disabled={props.index === 0}>
                <ArrowUpward />
            </IconButton>
            <IconButton sx={{ display: editing ? "inline-flex" : "none" }} onClick={() => moveItem(props.index, 1)} disabled={props.index === props.elements.length - 1}>
                <ArrowDownward />
            </IconButton>

            <IconButton sx={{ display: editing ? "inline-flex" : "none" }} onClick={() => deleteElement()}>
                <Delete />
            </IconButton>
            <IconButton sx={{ display: editing ? "inline-flex" : "none" }} onClick={() => handleSave()}>
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
        </Stack>
    </Box>
}