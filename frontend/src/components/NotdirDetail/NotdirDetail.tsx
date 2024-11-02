import { useEffect } from "react";
import { observer } from "mobx-react-lite";

import { main } from "../../../wailsjs/go/models";

import { notdirDetailStore } from "../../stores/NotdirDetailStore";

import AtomdirList from "../AtomdirList/AtomdirList";
import FileList from "../FileList/FileList";

type NotdirDetailProps = {
  notdir: main.Notdir;
};

const NotdirDetail = observer(({ notdir }: NotdirDetailProps) => {
  const handleAtomdirsUpdate = (updatedAtomdirs: main.Atomdir[]) => {
    notdirDetailStore.updateAtomdirs(updatedAtomdirs);
  };

  const handleFilesUpdate = (updatedFiles: main.FileInfo[]) => {
    notdirDetailStore.updateFiles(updatedFiles);
  };

  useEffect(() => {
    notdirDetailStore.setCurrentNotdir(notdir);
  }, [notdir]);

  return (
    <div className="w-full h-full flex flex-col gap-10">
      {notdirDetailStore.atomdirs.length > 0 && (
        <AtomdirList
          atomdirs={notdirDetailStore.atomdirs}
          setAtomdirs={handleAtomdirsUpdate}
        />
      )}
      {notdirDetailStore.files.length > 0 && (
        <FileList
          files={notdirDetailStore.files}
          setFiles={handleFilesUpdate}
        />
      )}
    </div>
  );
});

export default NotdirDetail;
