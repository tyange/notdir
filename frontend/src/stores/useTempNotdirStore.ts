import { create } from "zustand";

import { produce } from "immer";

import { Node } from "../types/Node";

type TempNotdirStore = {
  nodes: Node[];
  addNodes: (newNodes: Node | Node[]) => void;
  removeNode: (nodeId: string) => void;
  setNodes: (nodes: Node[]) => void;
};

export const useTempNotdirStore = create<TempNotdirStore>((set) => ({
  nodes: [],
  addNodes: (newNodes) =>
    set(
      produce((state) => {
        if (Array.isArray(newNodes)) {
          state.nodes.push(...newNodes);
        } else {
          state.nodes.push(newNodes);
        }
      })
    ),
  removeNode: (nodeId) =>
    set(
      produce((state) => {
        const index = state.nodes.findIndex(
          (node: Node) => node.file.Id === nodeId
        );
        if (index !== -1) {
          state.nodes.splice(index, 1);
        }
      })
    ),
  setNodes: (nodes) => set({ nodes }),
}));
