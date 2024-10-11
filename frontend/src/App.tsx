import { useMemo, useState } from "react";

import { main } from "../wailsjs/go/models";
import { MultiSelection, FileOpen } from "../wailsjs/go/main/App";
import DraggableItems from "./components/DraggableItems";

export default function App() {
  const [files, setFiles] = useState<main.FileInfo[]>([]);

  async function selectFiles(): Promise<void> {
    const result = await MultiSelection();
    setFiles(result);
  }

  async function fileOpenHandler(path: string): Promise<void> {
    await FileOpen(path);
  }

  const memoizedProps = useMemo(
    () => ({
      nodes: files.map((file) => ({
        key: file.Path,
        element: (
          <div
            className="border border-zinc-400"
            onDoubleClick={() => fileOpenHandler(file.Path)}
          >
            {file.Name}
          </div>
        ),
      })),
      draggingNodeClassName: "bg-red-600",
    }),
    [files]
  );

  return (
    <div id="App">
      <p className="text-red-600">notdir</p>
      <button className="btn btn-primary" onClick={selectFiles}>
        Select Files
      </button>
      <DraggableItems {...memoizedProps} />
    </div>
  );
}
