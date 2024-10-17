import { useState, DragEvent, CSSProperties, useCallback } from "react";

import { Node } from "../../types/Node";

type DraggableItemsProps<T> = {
  draggableItems: Node<T>[];
  setDraggableItems: (draggableItems: Node<T>[]) => void;
  draggingNodeClassName?: string;
  draggingNodeStyles?: CSSProperties;
};

export default function DraggableItems<T>({
  draggableItems,
  setDraggableItems,
  draggingNodeClassName,
  draggingNodeStyles,
}: DraggableItemsProps<T>) {
  const [isDragging, setIsDragging] = useState(false);
  const [currentDraggingNode, setCurrentDraggingNode] =
    useState<null | HTMLElement>();

  function getId(item: Node<any>): string {
    return "id" in item ? item.id : item.Id;
  }

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
      e.preventDefault();
      const currentTarget = e.currentTarget;

      if (!isDragging || !currentDraggingNode || !currentTarget) return;

      const currentItems = [...draggableItems];

      const draggedIndex = currentItems.findIndex((item) => {
        return getId(item) === currentDraggingNode.id;
      });
      const hoverIndex = currentItems.findIndex((item) => {
        return getId(item) === currentTarget.id;
      });

      if (draggedIndex === hoverIndex) {
        return currentItems;
      }

      const newItems = [...currentItems];
      const [draggedItem] = newItems.splice(draggedIndex, 1);
      newItems.splice(hoverIndex, 0, draggedItem);

      setDraggableItems(newItems);
    },
    [isDragging, currentDraggingNode, draggableItems]
  );

  const dragEnd = useCallback(() => {
    setIsDragging(false);
    setCurrentDraggingNode(null);
  }, []);

  function getNodeClassName(node: Node<T>) {
    if (
      isDragging &&
      currentDraggingNode &&
      draggingNodeClassName &&
      getId(node) === currentDraggingNode.id
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
      {draggableItems.map((draggableNode) => (
        <li
          id={getId(draggableNode)}
          key={getId(draggableNode)}
          draggable
          className={getNodeClassName(draggableNode)}
          onDragStart={dragStart}
          onDragEnter={dragEnter}
          onDragOver={dragOver}
          onDragEnd={dragEnd}
          style={getStyles(getId(draggableNode))}
        >
          {draggableNode.element}
        </li>
      ))}
    </ul>
  );
}
