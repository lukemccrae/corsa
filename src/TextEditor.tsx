import './App.css';
import { GlyfEditor } from './text-editor';

export const TextEditor = (): JSX.Element => {
  return (
    <div className="App">
      <h1 className="editorHeading">Corsa Editor</h1>
      <div className="editorWrapper">
        <GlyfEditor />
      </div>
    </div>
  );
}