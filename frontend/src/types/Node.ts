export type NodeId = { id: string } | { Id: string };

export type Node<T> = NodeId & {
  nodeInfo: T;
  element: JSX.Element;
};
