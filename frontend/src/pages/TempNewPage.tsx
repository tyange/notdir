import DraggableItems from "../components/DraggableItems/DraggableItems";

import { useTempNotdirStore } from "../stores/useTempNotdirStore";

import { Node } from "../types/Node";

type TempNewPageProps = {
  saveHandler: (nodes: Node[]) => void;
};

export default function TempNewPage({ saveHandler }: TempNewPageProps) {
  const { nodes } = useTempNotdirStore();

  return (
    <>
      <div>
        <button
          className="btn btn-secondary"
          onClick={() => saveHandler(nodes)}
        >
          Save
        </button>
      </div>
      <div>
        <DraggableItems draggingNodeClassName="bg-red-600" />
      </div>
    </>
  );
}
