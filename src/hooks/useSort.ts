import { useEffect } from "react";
import { useLocalStorage } from "@uidotdev/usehooks";
import {
  sortNotesAlpha,
  sortNotesByTime,
  areNotesSorted,
} from "../lib/appUtils";
import { useNotes } from ".";

export const useSort = () => {
  const { notes, setNotes } = useNotes();
  const [sortLabel, setSortLabel] = useLocalStorage("sort", "");

  const sortAlph = (isAscending: boolean) => {
    setNotes(sortNotesAlpha(notes, isAscending));
    setSortLabel(isAscending ? "alphAsc" : "alphDes");
  };
  const sortTime = (isAscending: boolean) => {
    setNotes(sortNotesByTime(notes, isAscending));
    setSortLabel(isAscending ? "timeAsc" : "timeDes");
  };
  // Verify notes are sorted after order change eg: drag or new note
  useEffect(() => {
    const isAlphSorted = (isAscending: boolean) =>
      areNotesSorted(
        notes,
        (a, b) => a.title.localeCompare(b.title),
        isAscending
      );

    const isTimeSorted = (isAscending: boolean) =>
      areNotesSorted(
        notes,
        (a, b) =>
          new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
        isAscending
      );

    if (sortLabel === "alphAsc" && !isAlphSorted(true)) setSortLabel("");
    if (sortLabel === "timeAsc" && !isTimeSorted(true)) setSortLabel("");
    if (sortLabel === "alphDes" && !isAlphSorted(false)) setSortLabel("");
    if (sortLabel === "timeDes" && !isTimeSorted(false)) setSortLabel("");
  }, [notes, setSortLabel, sortLabel]);

  return { sortLabel, sortAlph, sortTime };
};
