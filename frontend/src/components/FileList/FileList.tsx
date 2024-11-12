import { main } from "../../../wailsjs/go/models";
import { useNotdirDetailStore } from "../../stores/useNotdirDetailStore";

import DraggableItems from "../DraggableItems/DraggableItems";
import FileBox from "./FileBox/FileBox";

type FileListProps = {
  files: main.FileInfo[];
  setFiles: (updatedFiles: main.FileInfo[]) => void;
};

const FileList = ({ files, setFiles }: FileListProps) => {
  const { isEdit } = useNotdirDetailStore();

  const renderItem = (file: main.FileInfo, isDragging: boolean) => (
    <FileBox file={file} isDragging={isDragging} />
  );

  return (
    <ul className="flex flex-col gap-3">
      <DraggableItems<main.FileInfo>
        draggableItems={files}
        setDraggableItems={setFiles}
        renderItem={renderItem}
        isDisabledDrag={isEdit}
      />
    </ul>
  );
};

export default FileList;
