import { useState, DragEvent, useCallback, Dispatch } from "react";

type WithId = {
  Id: string;
};

type DraggableItemsProps<T extends WithId> = {
  draggableItems: T[];
  setDraggableItems: (updatedItems: T[]) => void;
  renderItem: (item: T, isDragging: boolean) => React.ReactNode;
};

export default function DraggableItems<T extends WithId>({
  draggableItems,
  setDraggableItems,
  renderItem,
}: DraggableItemsProps<T>) {
  const [isDragging, setIsDragging] = useState(false);
  const [currentDraggingNode, setCurrentDraggingNode] =
    useState<null | HTMLElement>();

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
        return item.Id === currentDraggingNode.id;
      });
      const hoverIndex = currentItems.findIndex((item) => {
        return item.Id === currentTarget.id;
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

  return (
    <>
      {draggableItems.map((item) => (
        <li
          id={item.Id}
          key={item.Id}
          draggable
          onDragStart={dragStart}
          onDragEnter={dragEnter}
          onDragOver={dragOver}
          onDragEnd={dragEnd}
        >
          {renderItem(
            item,
            Boolean(
              isDragging &&
                currentDraggingNode &&
                currentDraggingNode.id === item.Id
            )
          )}
        </li>
      ))}
    </>
  );
}
