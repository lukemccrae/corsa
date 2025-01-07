import './App.css';
import { GlyfEditor } from './text-editor';

export const TextEditor = (): JSX.Element => {
  return (
    <div className="App">
      <div className="editorWrapper">
        <GlyfEditor />
      </div>
    </div>
  );
}