import { useState } from "react";
import { observer } from "mobx-react-lite";

import { frontend, main } from "../../wailsjs/go/models";
import {
  FileSave,
  NotdirFileOpen,
  ShowMessageDialog,
} from "../../wailsjs/go/main/App";

import { notdirsStore } from "../stores/NodirsStore";
import { notdirDetailStore } from "../stores/NotdirDetailStore";

import Layout from "../components/Layout/Layout";
import Buttons, { ButtonsProps } from "../components/Buttons/Buttons";
import NotdirsContainer from "../components/NotdirsContainer/NotdirsContainer";
import NotdirBox from "../components/NotdirBox/NotdirBox";
import NotdirDetail from "../components/NotdirDetail/NotdirDetail";

const MainPage = observer(() => {
  const [hasNotdir, setHasNotdir] = useState(false);

  const notdirFileOpen = async () => {
    const result = await NotdirFileOpen();

    if (notdirsStore.notdirs.some((n) => n.Id === result.Id)) {
      ShowMessageDialog(
        new frontend.MessageDialogOptions({
          Type: "warning",
          Message: "해당 Notdir가 이미 열려 있습니다.",
          Buttons: ["Ok"],
        })
      );
      return;
    }

    notdirsStore.addNotdir(result);
  };

  const backToList = () => {
    setHasNotdir(false);
  };

  const handleSave = () => {
    notdirsStore.updateNotdir(
      notdirDetailStore.currentNotdirId,
      notdirDetailStore.atomdirs,
      notdirDetailStore.files
    );
    notdirDetailStore.syncWithUpdate();

    const notdir = notdirsStore.getNotdirById(
      notdirDetailStore.currentNotdirId
    );
    if (!notdir) {
      ShowMessageDialog(
        new frontend.MessageDialogOptions({
          Type: "warning",
          Message: "파일로 저장할 Notdir를 찾지 못했습니다.",
          Buttons: ["Ok"],
        })
      );
      return;
    }
    FileSave(notdir);
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

  const onClickNotdirHandler = (notdir: main.Notdir) => {
    setHasNotdir(true);
    notdirDetailStore.setCurrentNotdirId(notdir);
    notdirDetailStore.setCurrentAtomdirs(notdir);
    notdirDetailStore.setCurrentFiles(notdir);
  };

  return (
    <Layout>
      <Buttons {...buttonsProps} />
      <div className="flex-1 relative">
        {!hasNotdir && (
          <NotdirsContainer>
            {notdirsStore.notdirs.map((notdir) => (
              <li key={notdir.Id} onClick={() => onClickNotdirHandler(notdir)}>
                <NotdirBox page={notdir} />
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
