import { main } from "../../wailsjs/go/models";

export type Notdir = {
  id: string;
  name: string;
  notdirs: Notdir[];
  files: main.FileInfo[];
};
