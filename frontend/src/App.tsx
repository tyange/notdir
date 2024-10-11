import { useState } from "react";

import { main } from "../wailsjs/go/models";
import { MultiSelection, FileOpen } from "../wailsjs/go/main/App";

function App() {
  const [files, setFiles] = useState<main.FileInfo[]>([]);

  async function selectFiles(): Promise<void> {
    const result = await MultiSelection();
    setFiles(result);
  }

  async function fileOpenHandler(path: string): Promise<void> {
    await FileOpen(path);
  }

  return (
    <div id="App">
      <p className="text-red-600">notdir</p>
      <button className="btn btn-primary" onClick={selectFiles}>
        Select Files
      </button>
      <ul>
        {files &&
          files.length > 0 &&
          files.map((file) => (
            <li onClick={() => fileOpenHandler(file.Path)}>{file.Name}</li>
          ))}
      </ul>
    </div>
  );
}

export default App;
