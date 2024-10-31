import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";

import { frontend, main } from "../../wailsjs/go/models";
import {
  FileSave,
  GetInitialData,
  NotdirFileOpen,
  ShowMessageDialog,
} from "../../wailsjs/go/main/App";

import { notdirsBasesStore } from "../stores/NodirBasesStore";
import { notdirDetailStore } from "../stores/NotdirDetailStore";

import Layout from "../components/Layout/Layout";
import Buttons, { ButtonsProps } from "../components/Buttons/Buttons";
import NotdirsContainer from "../components/NotdirsContainer/NotdirsContainer";
import NotdirBox from "../components/NotdirBox/NotdirBox";
import NotdirDetail from "../components/NotdirDetail/NotdirDetail";

const MainPage = observer(() => {
  const [hasNotdir, setHasNotdir] = useState(false);

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

  const backToList = () => {
    setHasNotdir(false);
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

  const buttonsProps: ButtonsProps = {
    buttons: [
      {
        text: "back",
        handler: backToList,
        enabled: !!hasNotdir,
        disabled: false,
      },
      {
        text: "save",
        handler: handleSave,
        enabled: !!hasNotdir,
        disabled: !notdirDetailStore.hasAnyChanges,
      },
      {
        text: "open",
        handler: notdirFileOpen,
        enabled: !hasNotdir,
        disabled: false,
      },
    ],
  };

  const onClickNotdirHandler = async (notdirBase: main.NotdirBase) => {
    if (!notdirBase.Path || notdirBase.Path === "") {
      await ShowMessageDialog(
        new frontend.MessageDialogOptions({
          Message: "notdir의 경로가 없거나, 빈 문자열입니다.",
          Type: "warning",
        })
      );
      return;
    }

    try {
      const result = await NotdirFileOpen(notdirBase.Path);

      if (!result) {
        return;
      }

      notdirDetailStore.setCurrentNotdir(result);
      setHasNotdir(true);
    } catch (err) {
      await ShowMessageDialog(
        new frontend.MessageDialogOptions({
          Message: err,
          Type: "warning",
        })
      );
      console.error(err);
    }
  };

  const fetchInitialData = async () => {
    const result = await GetInitialData();
    notdirsBasesStore.setNotdirBases(result);
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  return (
    <Layout>
      <Buttons {...buttonsProps} />
      <div className="flex-1 relative">
        {!hasNotdir && (
          <NotdirsContainer>
            {notdirsBasesStore.notdirsBases.map((notdirBase) => (
              <li
                key={notdirBase.Id}
                onClick={() => onClickNotdirHandler(notdirBase)}
              >
                <NotdirBox notdir={notdirBase} />
              </li>
            ))}
          </NotdirsContainer>
        )}
        {hasNotdir && <NotdirDetail />}
      </div>
    </Layout>
  );
});

export default MainPage;
