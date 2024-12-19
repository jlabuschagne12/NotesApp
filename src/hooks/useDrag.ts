import { NoteType } from "@/types";

type DragHandlers = {
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, dropIndex: number) => void;
};

export const useDrag = (
  setNotes: React.Dispatch<React.SetStateAction<NoteType[]>>
): DragHandlers => {
  const onDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("dragIndex", index.toString());
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDrop = (e: React.DragEvent, dropIndex: number) => {
    const dragIndex = parseInt(e.dataTransfer.getData("dragIndex"), 10);

    if (dragIndex === dropIndex || dropIndex < 1) return;

    setNotes((prevNotes) => {
      const updatedNotes = [...prevNotes];
      const [movedNote] = updatedNotes.splice(dragIndex, 1);
      updatedNotes.splice(dropIndex, 0, movedNote);
      return updatedNotes;
    });
  };

  return { onDragStart, onDragOver, onDrop };
};
