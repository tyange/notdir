import { main } from "../../../wailsjs/go/models";

import NotdirBox from "./NotdirBox/NotdirBox";

type NotdirListProps = {
  notdirs: main.Notdir[];
};

export default function NotdirList({ notdirs }: NotdirListProps) {
  return (
    <ul className="grid grid-cols-3 sm:grid-cols-[repeat(auto-fill,minmax(100px,100px))] gap-4">
      {notdirs.map((notdir) => (
        <li key={notdir.Id}>
          <NotdirBox notdir={notdir} />
        </li>
      ))}
    </ul>
  );
}
