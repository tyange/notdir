import { Suspense } from "react";
import { useLocation, Outlet } from "react-router-dom";
import { observer } from "mobx-react-lite";

import {
  NotdirFileOpen,
  ShowMessageDialog,
  FileSave,
} from "../../../wailsjs/go/main/App";
import { frontend, main } from "../../../wailsjs/go/models";

import { notdirsBasesStore } from "../../stores/NodirBasesStore";
import { notdirDetailStore } from "../../stores/NotdirDetailStore";

import Buttons from "../Buttons/Buttons";
import Layout from "./Layout";

const MainLayout = observer(() => {
  const location = useLocation();
  const isDetailPage = location.pathname !== "/";

  const notdirFileOpen = async () => {
    const result = await NotdirFileOpen("");

    if (notdirsBasesStore.notdirsBases.some((n) => n.Id === result.Id)) {
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

  const buttonsProps = {
    buttons: [
      {
        text: "back",
        handler: () => window.history.back(),
        enabled: isDetailPage,
        disabled: false,
      },
      {
        text: "save",
        handler: handleSave,
        enabled: isDetailPage,
        disabled: !notdirDetailStore.hasAnyChanges,
      },
      {
        text: "open",
        handler: notdirFileOpen,
        enabled: !isDetailPage,
        disabled: false,
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
