import React, { useEffect, useState } from 'react';
import { $generateHtmlFromNodes } from '@lexical/html';
import { createEditor } from 'lexical';

interface ArticleRichTextHtmlProps {
  lexicaleditor: string; // JSON string of the Lexical state
}

export const ArticleRichTextHtml: React.FC<ArticleRichTextHtmlProps> = (props) => {
  const [htmlContent, setHtmlContent] = useState<string>('');

  useEffect(() => {
    const lexicaleditor = createEditor();

    // Initialize the editor with the provided state
    lexicaleditor.update(() => {
      const editorState = lexicaleditor.parseEditorState(props.lexicaleditor);
      lexicaleditor.setEditorState(editorState);
    });

    // Generate HTML from Lexical editor state
    lexicaleditor.getEditorState().read(() => {
      const htmlString = $generateHtmlFromNodes(lexicaleditor, null);

      // Parse the generated HTML string into actual DOM nodes
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlString, 'text/html');
      const htmlElement = doc.body;

      // Convert the DOM node to a string (outerHTML) to set it in React state
      if (htmlElement && htmlElement instanceof HTMLElement) {
        setHtmlContent(htmlElement.outerHTML);
      }
    });
  }, [props.lexicaleditor]);

  return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
};