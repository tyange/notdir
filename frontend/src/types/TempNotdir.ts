import { NestedNotdir } from "./NestedNotdir";
import { Node } from "./Node";

export type TempNotdir<T> = {
  name: string;
  notdirs: NestedNotdir[];
  nodes: Node<T>[];
};
