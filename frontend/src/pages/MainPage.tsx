import { useState } from "react";

import { main } from "../../wailsjs/go/models";
import { NotdirFileOpen } from "../../wailsjs/go/main/App";

import { usePagesStore } from "../stores/usePagesStore";

import Layout from "../components/Layout/Layout";
import Buttons, { ButtonsProps } from "../components/Buttons/Buttons";
import PagesContainer from "../components/PagesContainer/PagesContainer";
import PageBox from "../components/PageBox/PageBox";
import PageDetail from "../components/PageDetail/PageDetail";

export default function MainPage() {
  const { pages, addPage } = usePagesStore();
  const [selectedPage, setSelectedPage] = useState<main.Page | null>(null);

  const notdirFileOpen = async () => {
    const result = await NotdirFileOpen();
    addPage(result);
  };

  const backToList = () => {
    setSelectedPage(null);
  };

  const buttonsProps: ButtonsProps = {
    buttons: [
      {
        text: "back",
        handler: backToList,
        enabled: !!selectedPage,
      },
      {
        text: "open",
        handler: notdirFileOpen,
        enabled: !selectedPage,
      },
    ],
  };

  const onClickPageHandler = (page: main.Page) => {
    setSelectedPage(page);
  };

  return (
    <Layout>
      <Buttons {...buttonsProps} />
      <div className="flex-1 relative">
        {!selectedPage && (
          <PagesContainer>
            {pages.map((page) => (
              <li key={page.Id} onClick={() => onClickPageHandler(page)}>
                <PageBox page={page} />
              </li>
            ))}
          </PagesContainer>
        )}
        {selectedPage && <PageDetail page={selectedPage} />}
      </div>
    </Layout>
  );
}
