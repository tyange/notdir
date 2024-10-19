import { main } from "../../../../wailsjs/go/models";
import NotdirBox from "../../NotdirBox/NotdirBox";

type NotdirListProps = {
  notdirs: main.Notdir[];
};

export default function NotdirList({ notdirs }: NotdirListProps) {
  return (
    <ul className="grid grid-cols-3 gap-5">
      {notdirs.map((notdir) => (
        <li key={notdir.Id}>
          <NotdirBox notdir={notdir} />
        </li>
      ))}
    </ul>
  );
}
