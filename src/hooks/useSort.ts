import { useEffect } from "react";
import { useSessionStorage } from "@uidotdev/usehooks";
import { sortNotesAlpha, sortNotesByTime, areNotesSorted } from "../lib/appUtils";
import { NoteType } from "@/types";

export const useSort = (
  notes: NoteType[],
  setNotes: React.Dispatch<React.SetStateAction<NoteType[]>>,
  initialSort: string
) => {
  const [sort, setSort] = useSessionStorage<string>("sort", initialSort);

  // Apply sorting based on the `sort` state
  useEffect(() => {
    if (sort === "alphAsc") sortAlph(true);
    if (sort === "alphDes") sortAlph(false);
    if (sort === "timeAsc") sortTime(true);
    if (sort === "timeDes") sortTime(false);
  }, [sort]);

  // Verify notes are sorted after order change via drag
  useEffect(() => {
    if (sort === "alphAsc" && !isAlphSorted(true)) setSort("");
    if (sort === "timeAsc" && !isTimeSorted(true)) setSort("");
    if (sort === "alphDes" && !isAlphSorted(false)) setSort("");
    if (sort === "timeDes" && !isTimeSorted(false)) setSort("");
  }, [notes]);

  const isAlphSorted = (isAscending: boolean) =>
    areNotesSorted(notes, (a, b) => a.title.localeCompare(b.title), isAscending);
  
  const isTimeSorted = (isAscending: boolean) =>
    areNotesSorted(notes, (a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(), isAscending);

  const sortAlph = (isAscending: boolean) => setNotes((prev) => sortNotesAlpha(prev, isAscending));
  const sortTime = (isAscending: boolean) => setNotes((prev) => sortNotesByTime(prev, isAscending));

  return { sort, setSort };
};
