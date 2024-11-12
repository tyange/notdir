import { useNavigate, Outlet } from "react-router-dom";
import { isEqual } from "es-toolkit";

import {
  NotdirFileOpen,
  ShowMessageDialog,
  FileSave,
} from "../../../wailsjs/go/main/App";
import { frontend, main } from "../../../wailsjs/go/models";
import { useNotdirBasesStore } from "../../stores/useNotdirBasesStore";
import { useNotdirDetailStore } from "../../stores/useNotdirDetailStore";

import Buttons, { ButtonsProps } from "../Buttons/Buttons";
import Layout from "./Layout";

const MainLayout = () => {
  const notdirBases = useNotdirBasesStore((state) => state.notdirBases);
  const {
    addNotdirBase,
    isEdit: notdirBasesIsEdit,
    setIsEdit: setNotdirBasesIsEdit,
  } = useNotdirBasesStore();

  const currentNotdirId = useNotdirDetailStore(
    (state) => state.currentNotdirId
  );
  const notdirName = useNotdirDetailStore((state) => state.notdirName);
  const currentNotdirPath = useNotdirDetailStore(
    (state) => state.currentNotdirPath
  );
  const atomdirs = useNotdirDetailStore((state) => state.atomdirs);
  const files = useNotdirDetailStore((state) => state.files);
  const notdirDetailIsEdit = useNotdirDetailStore((state) => state.isEdit);
  const hasAtomdirsChanges = useNotdirDetailStore(
    (state) => !isEqual(state.atomdirs, state.initialAtomdirs)
  );
  const hasFilesChanges = useNotdirDetailStore(
    (state) => !isEqual(state.files, state.initialFiles)
  );
  const { syncWithUpdate, setIsEdit: setNotdirDetailIsEdit } =
    useNotdirDetailStore();

  const navigate = useNavigate();

  const notdirFileOpen = async () => {
    const result = await NotdirFileOpen("");

    if (notdirBases.some((n) => n.Id === result.Id)) {
      ShowMessageDialog(
        new frontend.MessageDialogOptions({
          Type: "warning",
          Message: "해당 Notdir가 이미 열려 있습니다.",
          Buttons: ["Ok"],
        })
      );
      return;
    }

    addNotdirBase(result);
  };

  const handleNotdirSave = async () => {
    await FileSave(
      new main.Notdir({
        Id: currentNotdirId,
        Name: notdirName,
        Path: currentNotdirPath,
        Atomdirs: atomdirs,
        Files: files,
      })
    );
    syncWithUpdate();
    setNotdirDetailIsEdit(false);
  };

  const handleNotdirBasesEdit = (isEdit: boolean) => {
    setNotdirBasesIsEdit(isEdit);
  };

  const handleNotdirEdit = (isEdit: boolean) => {
    setNotdirDetailIsEdit(isEdit);
  };

  const buttonsProps: ButtonsProps = {
    buttons: [
      {
        text: "open",
        visiblePaths: [{ path: "/", handler: notdirFileOpen, order: 1 }],
      },
      {
        text: "edit",
        visiblePaths: [
          {
            path: "/",
            condition: () => !notdirBasesIsEdit,
            handler: () => handleNotdirBasesEdit(true),
            order: 2,
          },
          {
            path: "notdir",
            condition: () => !notdirDetailIsEdit,
            handler: () => handleNotdirEdit(true),
            order: 2,
          },
        ],
      },
      {
        text: "back",
        visiblePaths: [
          {
            path: "notdir",
            handler: () => navigate("/"),
            order: 1,
          },
        ],
      },
      {
        text: "save",
        visiblePaths: [
          {
            path: "/",
            condition: () => notdirBasesIsEdit,
            handler: () => console.log("save"),
            order: 2,
          },
          {
            path: "notdir",
            condition: () => notdirDetailIsEdit,
            handler: handleNotdirSave,
            disabled: () => !(hasAtomdirsChanges || hasFilesChanges),
            order: 2,
          },
        ],
      },
    ],
  };

  return (
    <Layout>
      <Buttons {...buttonsProps} />
      <div className="flex-1 relative">
        <Outlet />
      </div>
    </Layout>
  );
};

export default MainLayout;
