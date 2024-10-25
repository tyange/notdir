import { Dispatch, SetStateAction } from "react";

import { main } from "../../../wailsjs/go/models";

import DraggableItems from "../DraggableItems/DraggableItems";
import NotdirBox from "./NotdirBox/NotdirBox";

type NotdirListProps = {
  notdirs: main.Notdir[];
  setNotdirs: (updatedNotdirs: main.Notdir[]) => void;
};

export default function NotdirList({ notdirs, setNotdirs }: NotdirListProps) {
  const renderItem = (notdir: main.Notdir, isDragging: boolean) => {
    return <NotdirBox notdir={notdir} isDragging={isDragging} />;
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
