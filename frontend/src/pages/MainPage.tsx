import { useState } from "react";
import { observer } from "mobx-react-lite";

import { main } from "../../wailsjs/go/models";
import { NotdirFileOpen } from "../../wailsjs/go/main/App";

import { notdirsStore } from "../stores/NodirsStore";

import Layout from "../components/Layout/Layout";
import Buttons, { ButtonsProps } from "../components/Buttons/Buttons";
import NotdirsContainer from "../components/NotdirsContainer/NotdirsContainer";
import NotdirBox from "../components/NotdirBox/NotdirBox";
import NotdirDetail from "../components/NotdirDetail/NotdirDetail";

const MainPage = observer(() => {
  const [selectedNotdir, setSelectedNotdir] = useState<main.Notdir | null>(
    null
  );

  const notdirFileOpen = async () => {
    const result = await NotdirFileOpen();
    notdirsStore.addNotdir(result);
  };

  const backToList = () => {
    setSelectedNotdir(null);
  };

  const buttonsProps: ButtonsProps = {
    buttons: [
      {
        text: "back",
        handler: backToList,
        enabled: !!selectedNotdir,
      },
      {
        text: "open",
        handler: notdirFileOpen,
        enabled: !selectedNotdir,
      },
    ],
  };

  const onClickPageHandler = (page: main.Notdir) => {
    setSelectedNotdir(page);
  };

  return (
    <Layout>
      <Buttons {...buttonsProps} />
      <div className="flex-1 relative">
        {!selectedNotdir && (
          <NotdirsContainer>
            {notdirsStore.notdirs.map((page) => (
              <li key={page.Id} onClick={() => onClickPageHandler(page)}>
                <NotdirBox page={page} />
              </li>
            ))}
          </NotdirsContainer>
        )}
        {selectedNotdir && <NotdirDetail notdir={selectedNotdir} />}
      </div>
    </Layout>
  );
});

export default MainPage;
