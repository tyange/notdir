import { useState, DragEvent, CSSProperties, useCallback } from "react";

import { useTempNotdirStore } from "../../stores/useTempNotdirStore";
import { main } from "../../../wailsjs/go/models";

export type DraggableChild = {
  file: main.FileInfo;
  element: React.ReactElement;
};

type DraggableItemsProps = {
  draggingNodeClassName?: string;
  draggingNodeStyles?: CSSProperties;
};

export default function DraggableItems({
  draggingNodeClassName,
  draggingNodeStyles,
}: DraggableItemsProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [currentDraggingNode, setCurrentDraggingNode] =
    useState<null | HTMLElement>();
  const { nodes, setNodes } = useTempNotdirStore();

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

      const currentItems = [...nodes];

      const draggedIndex = currentItems.findIndex(
        (item) => item.file.Id === currentDraggingNode.id
      );
      const hoverIndex = currentItems.findIndex(
        (item) => item.file.Id === currentTarget.id
      );

      if (draggedIndex === hoverIndex) return currentItems;

      const newItems = [...currentItems];
      const [draggedItem] = newItems.splice(draggedIndex, 1);
      newItems.splice(hoverIndex, 0, draggedItem);

      setNodes(newItems);
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
      node.file.Id === currentDraggingNode.id &&
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

  return (
    <ul>
      {nodes.map((draggableNode) => (
        <li
          id={draggableNode.file.Id}
          key={draggableNode.file.Id}
          draggable
          className={getNodeClassName(draggableNode)}
          onDragStart={dragStart}
          onDragEnter={dragEnter}
          onDragOver={dragOver}
          onDragEnd={dragEnd}
          style={getStyles(draggableNode.file.Id)}
        >
          {draggableNode.element}
        </li>
      ))}
    </ul>
  );
}
