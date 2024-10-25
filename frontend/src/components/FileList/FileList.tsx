import { Dispatch, SetStateAction } from "react";

import { main } from "../../../wailsjs/go/models";

import DraggableItems from "../DraggableItems/DraggableItems";
import FileBox from "./FileBox/FileBox";

type FileListProps = {
  files: main.FileInfo[];
  setFiles: (updatedFiles: main.FileInfo[]) => void;
};

export default function FileList({ files, setFiles }: FileListProps) {
  const renderItem = (file: main.FileInfo, isDragging: boolean) => (
    <FileBox file={file} isDragging={isDragging} />
  );

  return (
    <ul className="flex flex-col gap-3">
      <DraggableItems<main.FileInfo>
        draggableItems={files}
        setDraggableItems={setFiles}
        renderItem={renderItem}
      />
    </ul>
  );
}
