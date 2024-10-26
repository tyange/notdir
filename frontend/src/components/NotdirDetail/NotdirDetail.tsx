import { useState } from "react";

import { main } from "../../../wailsjs/go/models";

import AtomdirList from "../AtomdirList/AtomdirList";
import FileList from "../FileList/FileList";

type NotdirDetailProps = {
  notdir: main.Notdir;
};

export default function NotdirDetail({ notdir }: NotdirDetailProps) {
  const [atomdirs, setAtomdirs] = useState(notdir.Atomdirs);
  const [files, setFiles] = useState(notdir.Files);

  const handleAtomdirsUpdate = (updatedNotdirs: main.Atomdir[]) => {
    setAtomdirs(updatedNotdirs);
  };

  const handleFilesUpdate = (updatedFiles: main.FileInfo[]) => {
    setFiles(updatedFiles);
  };

  return (
    <div className="w-full h-full flex flex-col gap-10">
      {notdir.Atomdirs.length > 0 && (
        <AtomdirList atomdirs={atomdirs} setAtomdirs={handleAtomdirsUpdate} />
      )}
      {notdir.Files.length > 0 && (
        <FileList files={files} setFiles={handleFilesUpdate} />
      )}
    </div>
  );
}
