import classNames from "classnames";
import { main } from "../../../../wailsjs/go/models";

type NotdirBox = {
  notdir: main.Notdir;
  isDragging: boolean;
};

export default function NotdirBox({ notdir, isDragging }: NotdirBox) {
  const customClassName = classNames(
    "h-20",
    "rounded-xl",
    "flex",
    "justify-center",
    "items-center",
    "border",
    "shadow-md",
    { "bg-stone-200": !isDragging },
    { "bg-stone-300": isDragging }
  );

  return <div className={customClassName}>{notdir.Name}</div>;
}
