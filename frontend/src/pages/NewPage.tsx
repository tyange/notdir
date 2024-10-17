import { useState, ChangeEvent } from "react";
import DraggableItems from "../components/DraggableItems/DraggableItems";
import NotdirContainer from "../components/NotdirContainer/NotdirContainer";
import Layout from "../components/Layout/Layout";
import Buttons from "../components/Buttons/Buttons";

import { main } from "../../wailsjs/go/models";
import { MultiSelection, FileSave } from "../../wailsjs/go/main/App";
import { useTempPageStore } from "../stores/useTempPageStore";
import { Node } from "../types/Node";

export default function NewPage() {
  const [name, setName] = useState("");
  const [newNotdirName, setNewNotdirName] = useState("");
  const [notdirs, setNotdirs] = useState<main.Notdir[]>([]);

  const { nodes, setNodes } = useTempPageStore();

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

  function onChangeNameInput(e: ChangeEvent<HTMLInputElement>) {
    setName(e.target.value);
  }

  function onChangeNotdirNameInput(e: ChangeEvent<HTMLInputElement>) {
    setNewNotdirName(e.target.value);
  }

  function onAddNotdir() {
    const newNotdir = new main.Notdir({
      Id: crypto.randomUUID(),
      Name: newNotdirName,
      Files: [],
    });
    setNotdirs([...notdirs, newNotdir]);
  }

  function onSaveHandler() {
    FileSave(
      new main.Page({
        Id: crypto.randomUUID(),
        Name: name,
        Notdirs: notdirs,
        Files: nodes.map((node) => node.nodeInfo),
      })
    );
  }

  function setNotdirsHandler(draggableItems: Node<main.Notdir>[]) {
    setNotdirs(draggableItems.map((item) => item.nodeInfo));
  }

  const buttonsProps = {
    buttons: [{ text: "save", handler: onSaveHandler }],
  };

  return (
    <Layout>
      <Buttons {...buttonsProps} />
      <div>
        <label className="input input-bordered flex items-center gap-2">
          Page Name
          <input type="text" onChange={onChangeNameInput} />
        </label>
      </div>
      <div>
        <label className="input input-bordered flex items-center gap-2">
          Notdir Name
          <input type="text" onChange={onChangeNotdirNameInput} />
        </label>
        <button className="btn btn-accent" onClick={onAddNotdir}>
          add notdir
        </button>
      </div>
      <div>
        <DraggableItems
          draggableItems={notdirs.map((notdir) => ({
            id: notdir.Id,
            nodeInfo: notdir,
            element: <NotdirContainer notdir={notdir} />,
          }))}
          setDraggableItems={setNotdirsHandler}
        />
      </div>
      <div>
        <DraggableItems
          draggableItems={nodes}
          setDraggableItems={setNodes}
          draggingNodeClassName="bg-red-600"
        />
      </div>
    </Layout>
  );
}
