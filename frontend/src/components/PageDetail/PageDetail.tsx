import { main } from "../../../wailsjs/go/models";
import NotdirList from "../NotdirList/NotdirList";

type PageDetailProps = {
  page: main.Page;
};

export default function PageDetail({ page }: PageDetailProps) {
  return (
    <div className="w-full h-full">
      {page.Notdirs.length > 0 && <NotdirList notdirs={page.Notdirs} />}
    </div>
  );
}
