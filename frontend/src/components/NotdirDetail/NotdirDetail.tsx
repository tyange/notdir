import { useEffect } from "react";

import { main } from "../../../wailsjs/go/models";

import AtomdirList from "../AtomdirList/AtomdirList";
import FileList from "../FileList/FileList";
import { useNotdirDetailStore } from "../../stores/useNotdirDetailStore";

type NotdirDetailProps = {
  notdir: main.Notdir;
};

const NotdirDetail = ({ notdir }: NotdirDetailProps) => {
  const { atomdirs, updateAtomdirs, files, updateFiles, setCurrentNotdir } =
    useNotdirDetailStore();

  const handleAtomdirsUpdate = (updatedAtomdirs: main.Atomdir[]) => {
    updateAtomdirs(updatedAtomdirs);
  };

  const handleFilesUpdate = (updatedFiles: main.FileInfo[]) => {
    updateFiles(updatedFiles);
  };

  useEffect(() => {
    setCurrentNotdir(notdir);
  }, [notdir]);

  return (
    <div className="w-full h-full flex flex-col gap-10">
      {atomdirs.length > 0 && (
        <AtomdirList atomdirs={atomdirs} setAtomdirs={handleAtomdirsUpdate} />
      )}
      {files.length > 0 && (
        <FileList files={files} setFiles={handleFilesUpdate} />
      )}
    </div>
  );
};

export default NotdirDetail;
