import { useState } from "react";

import { main } from "../../../wailsjs/go/models";

import DraggableItems from "../DraggableItems/DraggableItems";
import FileBox from "./FileBox/FileBox";

type FileListProps = {
  initialFiles: main.FileInfo[];
};

export default function FileList({ initialFiles }: FileListProps) {
  const [files, setFiles] = useState(initialFiles);

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
