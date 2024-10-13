import { useState, ChangeEvent } from "react";
import DraggableItems from "../components/DraggableItems/DraggableItems";
import NotdirContainer from "../components/NotdirContainer/NotdirContainer";

import { main } from "../../wailsjs/go/models";
import { useTempNotdirStore } from "../stores/useTempNotdirStore";
import { Node } from "../types/Node";

type NewPageProps = {
  saveHandler: (notdir: main.Page) => void;
};

export default function NewPage({ saveHandler }: NewPageProps) {
  const [name, setName] = useState("");
  const [newNotdirName, setNewNotdirName] = useState("");
  const [notdirs, setNotdirs] = useState<main.Notdir[]>([]);

  const { nodes, setNodes } = useTempNotdirStore();

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

  function onClickSave() {
    saveHandler(
      new main.Page({
        Name: name,
        Notdirs: notdirs,
        Files: nodes.map((node) => node.nodeInfo),
      })
    );
  }

  function setNotdirsHandler(draggableItems: Node<main.Notdir>[]) {
    setNotdirs(draggableItems.map((item) => item.nodeInfo));
  }

  return (
    <>
      <div>
        <button className="btn btn-secondary" onClick={onClickSave}>
          Save
        </button>
      </div>
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
    </>
  );
}
