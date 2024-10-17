import Layout from "../components/Layout/Layout";
import Buttons, { ButtonsProps } from "../components/Buttons/Buttons";

import { NotdirFileOpen } from "../../wailsjs/go/main/App";

import { usePagesStore } from "../stores/usePagesStore";
import { useTempPageStore } from "../stores/useTempPageStore";

export default function MainPage() {
  const { pages, addPage } = usePagesStore();
  const {} = useTempPageStore();

  async function notdirFileOpen() {
    const result = await NotdirFileOpen();
    addPage(result);
  }

  const buttonsProps: ButtonsProps = {
    buttons: [
      {
        text: "open",
        handler: notdirFileOpen,
      },
    ],
  };

  return (
    <Layout>
      <Buttons {...buttonsProps} />
      <div className="flex-1 p-5 relative">
        <ul>
          {pages.map((page) => (
            <li key={page.Id}>{page.Name}</li>
          ))}
        </ul>
      </div>
    </Layout>
  );
}
