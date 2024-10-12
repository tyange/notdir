import {
  useState,
  DragEvent,
  CSSProperties,
  useCallback,
  useEffect,
} from "react";

export type DraggableChild = {
  key: string;
  element: React.ReactElement;
};

type DraggableItemsProps = {
  nodes: DraggableChild[];
  draggingNodeClassName?: string;
  draggingNodeStyles?: CSSProperties;
};

export default function DraggableItems({
  nodes,
  draggingNodeClassName,
  draggingNodeStyles,
}: DraggableItemsProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [currentDraggingNode, setCurrentDraggingNode] =
    useState<null | HTMLElement>();
  const [draggableNodes, setDraggableNodes] = useState(new Set(nodes));

  const dragStart = useCallback((e: DragEvent) => {
    setIsDragging(true);

    if (e.target instanceof HTMLElement) {
      setCurrentDraggingNode(e.target);
    }
  }, []);

  function dragEnter(e: DragEvent) {
    e.preventDefault();
  }

  const dragOver = useCallback(
    (e: DragEvent) => {
      const currentTarget = e.currentTarget;

      if (!isDragging || !currentDraggingNode || !currentTarget) return;

      setDraggableNodes((prevItems) => {
        const currentItems = [...prevItems];

        const draggedIndex = currentItems.findIndex(
          (item) => item.key === currentDraggingNode.id
        );
        const hoverIndex = currentItems.findIndex(
          (item) => item.key === currentTarget.id
        );

        if (draggedIndex === hoverIndex) return new Set(currentItems);

        const newItems = [...currentItems];
        const [draggedItem] = newItems.splice(draggedIndex, 1);
        newItems.splice(hoverIndex, 0, draggedItem);

        return new Set(newItems);
      });
    },
    [isDragging, currentDraggingNode]
  );

  const dragEnd = useCallback(() => {
    setIsDragging(false);
    setCurrentDraggingNode(null);
  }, []);

  function getNodeClassName(node: DraggableChild) {
    if (
      isDragging &&
      currentDraggingNode &&
      node.key === currentDraggingNode.id &&
      draggingNodeClassName
    ) {
      return [node.element.props.className, draggingNodeClassName].join(" ");
    }

    return node.element.props.className;
  }

  function getStyles(key: string) {
    if (
      isDragging &&
      currentDraggingNode &&
      key === currentDraggingNode.id &&
      draggingNodeStyles
    ) {
      return { ...draggingNodeStyles };
    }
  }

  useEffect(() => {
    setDraggableNodes(new Set(nodes));
  }, [nodes]);

  return (
    <ul>
      {[...draggableNodes].map((draggableNode) => (
        <li
          id={draggableNode.key}
          key={draggableNode.key}
          draggable
          className={getNodeClassName(draggableNode)}
          onDragStart={dragStart}
          onDragEnter={dragEnter}
          onDragOver={dragOver}
          onDragEnd={dragEnd}
          style={getStyles(draggableNode.key)}
        >
          {draggableNode.element}
        </li>
      ))}
    </ul>
  );
}
