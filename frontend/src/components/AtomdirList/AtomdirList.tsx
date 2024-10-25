import { main } from "../../../wailsjs/go/models";

import DraggableItems from "../DraggableItems/DraggableItems";
import AtomdirBox from "./AtomdirBox/AtomdirBox";

type AtomdirListProps = {
  notdirs: main.Notdir[];
  setNotdirs: (updatedNotdirs: main.Notdir[]) => void;
};

export default function AtomdirList({ notdirs, setNotdirs }: AtomdirListProps) {
  const renderItem = (notdir: main.Notdir, isDragging: boolean) => {
    return <AtomdirBox notdir={notdir} isDragging={isDragging} />;
  };

  return (
    <ul className="grid grid-cols-3 sm:grid-cols-[repeat(auto-fill,minmax(100px,100px))] gap-4">
      <DraggableItems<main.Notdir>
        draggableItems={notdirs}
        setDraggableItems={setNotdirs}
        renderItem={renderItem}
      />
    </ul>
  );
}
