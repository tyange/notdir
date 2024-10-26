import classNames from "classnames";
import { main } from "../../../../wailsjs/go/models";

type AtomdirBox = {
  atomdir: main.Atomdir;
  isDragging: boolean;
};

export default function AtomdirBox({ atomdir, isDragging }: AtomdirBox) {
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

  return <div className={customClassName}>{atomdir.Name}</div>;
}
