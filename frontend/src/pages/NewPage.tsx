import { useState, ChangeEvent } from "react";
import DraggableItems from "../components/DraggableItems/DraggableItems";
import NestedNotdirContainer from "../components/NestedNotdirContainer/NestedNotdirContainer";

import { main } from "../../wailsjs/go/models";
import { useTempNotdirStore } from "../stores/useTempNotdirStore";
import { Node } from "../types/Node";
import { TempNotdir } from "../types/TempNotdir";
import { NestedNotdir } from "../types/NestedNotdir";

type NewPageProps = {
  saveHandler: (notdir: TempNotdir<main.FileInfo>) => void;
};

export default function NewPage({ saveHandler }: NewPageProps) {
  const [name, setName] = useState("");
  const [newNotdirName, setNewNotdirName] = useState("");
  const [nestedNotdirs, setNestedNotdirs] = useState<NestedNotdir[]>([]);

  const { nodes, setNodes } = useTempNotdirStore();

  function onChangeNameInput(e: ChangeEvent<HTMLInputElement>) {
    setName(e.target.value);
  }

  function onChangeNotdirNameInput(e: ChangeEvent<HTMLInputElement>) {
    setNewNotdirName(e.target.value);
  }

  function onAddNotdir() {
    const newNotdir = {
      id: crypto.randomUUID(),
      name: newNotdirName,
      notdirs: [],
      files: [],
    };
    setNestedNotdirs([...nestedNotdirs, newNotdir]);
  }

  function onClickSave() {
    saveHandler({ name, notdirs: nestedNotdirs, nodes });
  }

  function setNestedNotdirsHandler(draggableItems: Node<NestedNotdir>[]) {
    setNestedNotdirs(draggableItems.map((item) => item.nodeInfo));
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
          draggableItems={nestedNotdirs.map((nestedNotdir) => ({
            id: nestedNotdir.id,
            nodeInfo: nestedNotdir,
            element: <NestedNotdirContainer nestedNotdir={nestedNotdir} />,
          }))}
          setDraggableItems={setNestedNotdirsHandler}
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
