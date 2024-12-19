import { NoteType } from "@/types";

export const sortNotesAlpha = (notes: NoteType[], isAscending: boolean): NoteType[] => {
  const exempt = notes[0];
  const sorted = [...notes.slice(1)].sort((a, b) =>
    isAscending ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
  );
  return [exempt, ...sorted];
};

export const sortNotesByTime = (notes: NoteType[], isAscending: boolean): NoteType[] => {
  const exempt = notes[0];
  const sorted = [...notes.slice(1)].sort((a, b) =>
    isAscending
      ? new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
      : new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
  return [exempt, ...sorted];
};

export const areNotesSorted = (
  notes: NoteType[],
  compare: (a: NoteType, b: NoteType) => number,
  isAscending: boolean
): boolean => {
  for (let i = 1; i < notes.length - 1; i++) {
    if (isAscending ? compare(notes[i], notes[i + 1]) > 0 : compare(notes[i], notes[i + 1]) < 0) {
      return false;
    }
  }
  return true;
};

export const calculatePositions = (
  notes: NoteType[],
  width: number,
  cellWidth: number
): { x: number; y: number }[] => {
  const newColumns = Math.max(1, Math.floor(width / cellWidth));
  const gap =
    newColumns > 1 ? (width - cellWidth * newColumns) / (newColumns - 1) : 0;

  return notes.map((_, index) => {
    const column = index % newColumns;
    const row = Math.floor(index / newColumns);

    return {
      x: column * (cellWidth + gap),
      y: row * cellWidth,
    };
  });
};

