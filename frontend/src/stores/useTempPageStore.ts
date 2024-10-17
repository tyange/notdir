import { create } from "zustand";

import { produce } from "immer";

import { main } from "../../wailsjs/go/models";
import { Node } from "../types/Node";

type TempPageStore<T> = {
  nodes: Node<T>[];
  addNodes: (newNodes: Node<T> | Node<T>[]) => void;
  removeNode: (nodeId: string) => void;
  setNodes: (nodes: Node<T>[]) => void;
};

export const useTempPageStore = create<TempPageStore<main.FileInfo>>((set) => ({
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
          (node: Node<main.FileInfo>) => node.nodeInfo.Id === nodeId
        );
        if (index !== -1) {
          state.nodes.splice(index, 1);
        }
      })
    ),
  setNodes: (nodes) => {
    set({ nodes });
  },
}));
