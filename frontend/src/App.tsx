import { MultiSelection, FileOpen, FileSave } from "../wailsjs/go/main/App";
import { main } from "../wailsjs/go/models";

import MainPage from "./pages/MainPage";
import NewPage from "./pages/NewPage";

import { useTempNotdirStore } from "./stores/useTempNotdirStore";

import { Draft } from "./types/Draft";

export default function App() {
  const { setNodes } = useTempNotdirStore();

  async function selectFiles(): Promise<void> {
    const result = await MultiSelection();
    setNodes(
      result.map((file) => ({
        id: file.Id,
        nodeInfo: file,
        element: <div className="border border-gray-50">{file.Name}</div>,
      }))
    );
  }

  async function fileOpenHandler(path: string): Promise<void> {
    await FileOpen(path);
  }

  async function saveHandler(draft: main.Page) {
    FileSave(draft);
  }

  return (
    <div id="App">
      <p className="text-red-600">notdir</p>
      <button className="btn btn-primary" onClick={selectFiles}>
        Select Files
      </button>
      <NewPage saveHandler={saveHandler} />
      <div className="divider"></div>
      <MainPage />
    </div>
  );
}
