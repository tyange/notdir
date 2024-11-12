import { main } from "../../../wailsjs/go/models";
import { useNotdirDetailStore } from "../../stores/useNotdirDetailStore";

import DraggableItems from "../DraggableItems/DraggableItems";
import AtomdirBox from "./AtomdirBox/AtomdirBox";

type AtomdirListProps = {
  atomdirs: main.Atomdir[];
  setAtomdirs: (updatedNotdirs: main.Atomdir[]) => void;
};

const AtomdirList = ({ atomdirs, setAtomdirs }: AtomdirListProps) => {
  const { isEdit } = useNotdirDetailStore();

  const renderItem = (atomdir: main.Atomdir, isDragging: boolean) => {
    return <AtomdirBox atomdir={atomdir} isDragging={isDragging} />;
  };

  return (
    <ul className="grid grid-cols-3 sm:grid-cols-[repeat(auto-fill,minmax(100px,100px))] gap-4">
      <DraggableItems<main.Atomdir>
        draggableItems={atomdirs}
        setDraggableItems={setAtomdirs}
        renderItem={renderItem}
        isDisabledDrag={isEdit}
      />
    </ul>
  );
};

export default AtomdirList;
