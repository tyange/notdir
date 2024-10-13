import { main } from "../../wailsjs/go/models";

export type NestedNotdir = {
  id: string;
  name: string;
  files: main.FileInfo[];
};
