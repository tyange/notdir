import { main } from "../../../wailsjs/go/models";

type PageBoxProps = {
  page: main.Page;
};

export default function PageBox({ page }: PageBoxProps) {
  return (
    <div className="h-40 bg-slate-100 rounded-xl flex justify-center items-center border border-slate-200 shadow-md hover:bg-slate-200 cursor-pointer">
      <span>{page.Name}</span>
    </div>
  );
}
