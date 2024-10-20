import { main } from "../../../wailsjs/go/models";

import NotdirList from "../NotdirList/NotdirList";
import FileList from "../FileList/FileList";

type PageDetailProps = {
  page: main.Page;
};

export default function PageDetail({ page }: PageDetailProps) {
  return (
    <div className="w-full h-full flex flex-col gap-10">
      {page.Notdirs.length > 0 && <NotdirList initialNotdir={page.Notdirs} />}
      {page.Files.length > 0 && <FileList initialFiles={page.Files} />}
    </div>
  );
}
