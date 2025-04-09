import { ArrowDownward, ArrowUpward, Delete, Edit, Save } from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
} from '@mui/material';
import { Editor } from '@tinymce/tinymce-react';
import { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { ElementsMap } from './Details';

interface TextEditorProps {
  text: string;
  elements: ElementsMap;
  index: number;
  updateTextElement: Function;
  setElementIdsForOrder: Function;
  elementIdsForOrder: string[];
}

export const TextEditor = (props: TextEditorProps) => {
  const [editing, setEditing] = useState(false);
  const [deleteCheck, setDeleteCheck] = useState(false);
  const [newText, setNewText] = useState<string>('');

  useEffect(() => {
    setNewText(DOMPurify.sanitize(props.text));
  }, []);

  const moveItem = (index: number, direction: number) => {
    const updatedElementIds = [...props.elementIdsForOrder];
    const newIndex = index + direction;
    // Ensure the new index is within bounds
    if (newIndex < 0 || newIndex >= updatedElementIds.length) {
      return; // Do nothing if the new index is out of bounds
    }

    // Swap the elements at index and newIndex
    [updatedElementIds[index], updatedElementIds[newIndex]] = [
      updatedElementIds[newIndex],
      updatedElementIds[index],
    ];

    props.setElementIdsForOrder(updatedElementIds);
  };

  const deleteElement = () => {
    setDeleteCheck(true);
  };

  const handleCancelDelete = () => {
    setDeleteCheck(false);
  };

  // // handle saving the text box to the element map
  const handleSave = () => {
    console.log(props.elementIdsForOrder);
    props.updateTextElement(newText, props.index);
    setEditing(false);
  };

  const handleConfirmDelete = () => {
    // remove the element from the element map
    const updatedElementIds = [...props.elementIdsForOrder];
    updatedElementIds.splice(props.index, 1);
    props.setElementIdsForOrder(updatedElementIds);
    setDeleteCheck(false);
  };

  const handleEditorChange = (text: any) => {
    // need to test this with XSS examples =P
    const sanitizedContent = DOMPurify.sanitize(text.level.content);
    setNewText(sanitizedContent);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', position: 'relative' }}>
      {editing ? (
        <Editor
          apiKey="lc1hsudemo0gx33vhn59zisxgvcp3fktuvifbvk6xnrt7jbh"
          init={{
            selector: '#tinymce',
            branding: false,
            width: 480,
            image_dimensions: false,
            image_default_width: 480,
            content_style: 'img {max-width: 100%; height: auto;}',
            plugins: [
              // Core editing features
              'anchor',
              'autolink',
              'emoticons',
              'image',
              'link',
              'lists',
              'visualblocks',
              // Your account includes a free trial of TinyMCE premium features
              // Try the most popular premium features until Apr 9, 2025:
              // 'checklist', 'mediaembed', 'casechange', 'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste', 'advtable', 'advcode', 'editimage', 'advtemplate', 'ai', 'mentions', 'tinycomments', 'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 'typography', 'inlinecss', 'markdown', 'importword', 'exportword', 'exportpdf'
            ],
            menubar: 'edit insert view format tools table help', // Removed "file"
            toolbar:
              'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
            tinycomments_mode: 'embedded',
            tinycomments_author: 'Author name',
            mergetags_list: [
              { value: 'First.Name', title: 'First Name' },
              { value: 'Email', title: 'Email' },
            ],
            // @ts-ignore
            setup: editor => {
              // @ts-ignore
              editor.on('NodeChange', e => {
                const images = editor.getBody().querySelectorAll('img');
                // @ts-ignore
                images.forEach(img => {
                  img.style.maxWidth = '100%';
                  img.style.height = 'auto';
                });
              });
            },
            // ai_request: (request, respondWith) => respondWith.string(() => Promise.reject('See docs to implement AI Assistant')),
          }}
          initialValue={DOMPurify.sanitize(props.text)}
          onChange={handleEditorChange}
        />
      ) : (
        <div style={{ width: '485px' }} dangerouslySetInnerHTML={{ __html: props.text }}></div>
      )}
      <Stack direction="column">
        <IconButton onClick={() => setEditing(!editing)}>
          <Edit />
        </IconButton>
        <IconButton
          sx={{ display: editing ? 'none' : 'inline-flex' }}
          onClick={() => moveItem(props.index, -1)}
          disabled={props.index === 0}
        >
          <ArrowUpward />
        </IconButton>
        <IconButton
          sx={{ display: editing ? 'none' : 'inline-flex' }}
          onClick={() => moveItem(props.index, 1)}
          disabled={props.index === props.elementIdsForOrder.length - 1}
        >
          <ArrowDownward />
        </IconButton>
        <IconButton
          sx={{ display: editing ? 'inline-flex' : 'none' }}
          onClick={() => deleteElement()}
        >
          <Delete />
        </IconButton>
        <IconButton sx={{ display: editing ? 'inline-flex' : 'none' }} onClick={() => handleSave()}>
          <Save />
        </IconButton>
        <Dialog open={deleteCheck} onClose={handleCancelDelete}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>Are you sure you want to delete this item?</DialogContent>
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
  );
};
