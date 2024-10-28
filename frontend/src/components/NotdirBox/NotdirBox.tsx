import { main } from "../../../wailsjs/go/models";

type NotdirBoxProps = {
  notdir: main.NotdirBase;
};

export default function NotdirBox({ notdir }: NotdirBoxProps) {
  return (
    <div className="h-40 bg-slate-100 rounded-xl flex justify-center items-center border border-slate-200 shadow-md hover:bg-slate-200 cursor-pointer">
      <span>{notdir.Name}</span>
    </div>
  );
}
