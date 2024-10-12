import { main } from "../../wailsjs/go/models";

export type Node = {
  file: main.FileInfo;
  element: JSX.Element;
};
