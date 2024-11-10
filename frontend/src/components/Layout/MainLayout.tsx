import { useState } from "react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import { observer } from "mobx-react-lite";

import {
  NotdirFileOpen,
  ShowMessageDialog,
  FileSave,
} from "../../../wailsjs/go/main/App";
import { frontend, main } from "../../../wailsjs/go/models";

import { notdirsBasesStore } from "../../stores/NotdirBasesStore";
import { notdirDetailStore } from "../../stores/NotdirDetailStore";

import Buttons, { ButtonsProps } from "../Buttons/Buttons";
import Layout from "./Layout";

const MainLayout = observer(() => {
  const [isEdit, setIsEdit] = useState(false);

  const navigate = useNavigate();

  const notdirFileOpen = async () => {
    const result = await NotdirFileOpen("");

    if (notdirsBasesStore.notdirBases.some((n) => n.Id === result.Id)) {
      ShowMessageDialog(
        new frontend.MessageDialogOptions({
          Type: "warning",
          Message: "해당 Notdir가 이미 열려 있습니다.",
          Buttons: ["Ok"],
        })
      );
      return;
    }

    notdirsBasesStore.addNotdirBase(result);
  };

  const handleChangeNotdirList = () => {};

  const handleSave = async () => {
    await FileSave(
      new main.Notdir({
        Id: notdirDetailStore.currentNotdirId,
        Name: notdirDetailStore.notdirName,
        Path: notdirDetailStore.currentNotdirPath,
        Atomdirs: notdirDetailStore.atomdirs,
        Files: notdirDetailStore.files,
      })
    );
    notdirDetailStore.syncWithUpdate();
  };

  const handleEdit = () => {
    setIsEdit(true);
  };

  const buttonsProps: ButtonsProps = {
    buttons: [
      {
        text: "open",
        visiblePaths: [{ path: "/", handler: notdirFileOpen }],
      },
      {
        text: "edit",

        visiblePaths: [
          { path: "/", condition: () => !isEdit, handler: handleEdit },
        ],
      },
      {
        text: "back",
        visiblePaths: [
          {
            path: "notdir",
            handler: () => navigate("/"),
          },
        ],
      },
      {
        text: "save",
        visiblePaths: [
          {
            path: "/",
            condition: () => isEdit,
            handler: () => console.log("save"),
          },
          {
            path: "notdir",
            handler: handleSave,
            disabled: () => !notdirDetailStore.hasAnyChanges,
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
});

export default MainLayout;
