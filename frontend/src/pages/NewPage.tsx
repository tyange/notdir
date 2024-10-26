import { useState, ChangeEvent } from "react";

import { main } from "../../wailsjs/go/models";
import { MultiSelection, FileSave } from "../../wailsjs/go/main/App";

import Layout from "../components/Layout/Layout";
import Buttons, { ButtonsProps } from "../components/Buttons/Buttons";
import DraggableItems from "../components/DraggableItems/DraggableItems";
import AtomdirBox from "../components/AtomdirList/AtomdirBox/AtomdirBox";
import FileBox from "../components/FileList/FileBox/FileBox";

export default function NewPage() {
  const [name, setName] = useState("");
  const [newAtomdirName, setNewAtomdirName] = useState("");
  const [atomdirs, setAtomdirs] = useState<main.Atomdir[]>([]);
  const [files, setFiles] = useState<main.FileInfo[]>([]);

  const selectFiles = async (): Promise<void> => {
    const result = await MultiSelection();
    setFiles(result);
  };

  const onChangeNameInput = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const onChangeAtomdirNameInput = (e: ChangeEvent<HTMLInputElement>) => {
    setNewAtomdirName(e.target.value);
  };

  const onAddAtomdir = () => {
    const newAtomdir = new main.Atomdir({
      Id: crypto.randomUUID(),
      Name: newAtomdirName,
      Files: [],
    });

    setAtomdirs([...atomdirs, newAtomdir]);
  };

  const onSaveHandler = () => {
    FileSave(
      new main.Notdir({
        Id: crypto.randomUUID(),
        Name: name,
        Atomdirs: atomdirs,
        Files: files,
      })
    );
  };

  const handleAtomdirsUpdate = (updatedNotdirs: main.Atomdir[]) => {
    setAtomdirs(updatedNotdirs);
  };

  const renderAtomdir = (atomdir: main.Atomdir, isDragging: boolean) => {
    return <AtomdirBox atomdir={atomdir} isDragging={isDragging} />;
  };

  const handleFilesUpdate = (updatedFiles: main.FileInfo[]) => {
    setFiles(updatedFiles);
  };

  const renderFile = (file: main.FileInfo, isDragging: boolean) => (
    <FileBox file={file} isDragging={isDragging} />
  );

  const buttonsProps: ButtonsProps = {
    buttons: [{ text: "save", handler: onSaveHandler, enabled: true }],
  };

  return (
    <Layout>
      <Buttons {...buttonsProps} />
      <div>
        <label className="input input-bordered flex items-center gap-2">
          Page Name
          <input type="text" onChange={onChangeNameInput} />
        </label>
      </div>
      <div>
        <label className="input input-bordered flex items-center gap-2">
          Atomdir Name
          <input type="text" onChange={onChangeAtomdirNameInput} />
        </label>
        <div className="join">
          <button className="join-item btn" onClick={onAddAtomdir}>
            add atomdir
          </button>
          <button className="join-item btn" onClick={selectFiles}>
            select files
          </button>
        </div>
      </div>
      <div>
        <DraggableItems<main.Atomdir>
          draggableItems={atomdirs}
          setDraggableItems={handleAtomdirsUpdate}
          renderItem={renderAtomdir}
        />
      </div>
      <div>
        <DraggableItems<main.FileInfo>
          draggableItems={files}
          setDraggableItems={handleFilesUpdate}
          renderItem={renderFile}
        />
      </div>
    </Layout>
  );
}
