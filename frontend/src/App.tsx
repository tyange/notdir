import { MultiSelection, FileOpen } from "../wailsjs/go/main/App";

import MainPage from "./pages/MainPage";
import TempNewPage from "./pages/TempNewPage";

import { useTempNotdirStore } from "./stores/useTempNotdirStore";

import { Node } from "./types/Node";

export default function App() {
  const { setNodes } = useTempNotdirStore();

  async function selectFiles(): Promise<void> {
    const result = await MultiSelection();
    setNodes(
      result.map((file) => ({
        file,
        element: <div className="border border-gray-50">{file.Name}</div>,
      }))
    );
  }

  async function fileOpenHandler(path: string): Promise<void> {
    await FileOpen(path);
  }

  async function saveHandler(nodes: Node[]) {
    console.log(nodes);
  }

  return (
    <div id="App">
      <p className="text-red-600">notdir</p>
      <button className="btn btn-primary" onClick={selectFiles}>
        Select Files
      </button>
      <TempNewPage saveHandler={saveHandler} />
      <div className="divider"></div>
      <MainPage />
    </div>
  );
}
