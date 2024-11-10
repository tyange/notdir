import { main } from "../../../wailsjs/go/models";

type NotdirBoxProps = {
  notdir: main.NotdirBase;
  onClick: () => void;
};

export default function NotdirBox({ notdir, onClick }: NotdirBoxProps) {
  return (
    <div
      className="h-40 bg-slate-100 rounded-xl flex justify-center items-center border border-slate-200 shadow-md hover:bg-slate-200 cursor-pointer"
      onClick={onClick}
    >
      <span>{notdir.Name}</span>
    </div>
  );
}
