import { main } from "../../../../wailsjs/go/models";

type NotdirBox = {
  notdir: main.Notdir;
};

export default function NotdirBox({ notdir }: NotdirBox) {
  return (
    <div className="h-20 bg-stone-100 rounded-xl flex justify-center items-center border border-stone-200 shadow-md hover:bg-stone-200 cursor-pointer">
      {notdir.Name}
    </div>
  );
}
