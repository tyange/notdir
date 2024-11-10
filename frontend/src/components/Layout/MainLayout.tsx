import { useEffect, useState } from "react";
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

  const handleNotdirSave = async () => {
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
    notdirDetailStore.setIsEdit(false);
  };

  const handleNotdirBasesEdit = (isEdit: boolean) => {
    notdirsBasesStore.setIsEdit(isEdit);
  };

  const handleNotdirEdit = (isEdit: boolean) => {
    notdirDetailStore.setIsEdit(isEdit);
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
            condition: () => !notdirsBasesStore.isEdit,
            handler: () => handleNotdirBasesEdit(true),
            order: 2,
          },
          {
            path: "notdir",
            condition: () => !notdirDetailStore.isEdit,
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
            condition: () => notdirsBasesStore.isEdit,
            handler: () => console.log("save"),
            order: 2,
          },
          {
            path: "notdir",
            condition: () => notdirDetailStore.isEdit,
            handler: handleNotdirSave,
            disabled: () => !notdirDetailStore.hasAnyChanges,
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
});

export default MainLayout;
