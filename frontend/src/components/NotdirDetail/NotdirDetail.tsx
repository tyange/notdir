import { Dispatch, SetStateAction, useState } from "react";

import { main } from "../../../wailsjs/go/models";

import NotdirList from "../NotdirList/NotdirList";
import FileList from "../FileList/FileList";

type NotdirDetailProps = {
  page: main.Page;
  setSelectedPage: Dispatch<SetStateAction<main.Page | null>>;
};

export default function NotdirDetail({
  page,
  setSelectedPage,
}: NotdirDetailProps) {
  const [notdirs, setNotdirs] = useState(page.Notdirs);
  const [files, setFiles] = useState(page.Files);

  const handleNotdirsUpdate = (updatedNotdirs: main.Notdir[]) => {
    setNotdirs(updatedNotdirs);
  };

  const handleFilesUpdate = (updatedFiles: main.FileInfo[]) => {
    setFiles(updatedFiles);
  };

  return (
    <div className="w-full h-full flex flex-col gap-10">
      {page.Notdirs.length > 0 && (
        <NotdirList notdirs={notdirs} setNotdirs={handleNotdirsUpdate} />
      )}
      {page.Files.length > 0 && (
        <FileList files={files} setFiles={handleFilesUpdate} />
      )}
    </div>
  );
}
