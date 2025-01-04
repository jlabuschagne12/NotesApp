import { useLocalStorage } from "@uidotdev/usehooks";
import { v4 as uuidv4 } from "uuid";
import { NoteType } from "@/types";
import { useToast } from "@/hooks/use-toast";

export const useNotes = () => {
  const { toast } = useToast();
  const [notes, setNotes] = useLocalStorage<NoteType[]>("notes", [
    {
      id: uuidv4(),
      title: "",
      body: "",
      colorIndex: 0,
      updatedAt: new Date().toISOString(),
    },
  ]);

  const addNote = () => {
    setNotes([
      {
        id: uuidv4(),
        title: "",
        body: "",
        colorIndex: notes[0].colorIndex,
        updatedAt: new Date().toISOString(),
      },
      ...notes,
    ]);
    toast({ description: "Note added." });
  };

  const updateNote = (id: string, updates: Partial<NoteType>) => {
    setNotes(
      notes.map((note) =>
        note.id === id
          ? { ...note, ...updates, updatedAt: new Date().toISOString() }
          : note
      )
    );
    toast({ description: "Note updated." });
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id));
    toast({ description: "Note deleted." });
  };

  const deleteAllNotes = () => {
    setNotes(notes.filter((_, index) => index === 0));
    toast({ description: "All Notes deleted." });
  };

  return { notes, setNotes, addNote, updateNote, deleteNote, deleteAllNotes };
};
