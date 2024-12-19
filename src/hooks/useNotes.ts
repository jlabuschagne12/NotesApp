import { useSessionStorage } from "@uidotdev/usehooks";
import { v4 as uuidv4 } from "uuid";
import { NoteType } from "@/types";
import { useToast } from "@/hooks/use-toast"

export const useNotes = (initialColorIndex: number) => {
  const [notes, setNotes] = useSessionStorage<NoteType[]>("notes", []);
  const { toast } = useToast();

  const addNote = () => {
    setNotes((prev) => [
      {
        id: uuidv4(),
        title: "",
        body: "",
        colorIndex: initialColorIndex,
        updatedAt: new Date().toISOString(),
      },
      ...prev,
    ]);
    toast({ description: "Note added." });
  };

  const updateNote = (id: string, updates: Partial<NoteType>) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id ? { ...note, ...updates, updatedAt: new Date().toISOString() } : note
      )
    );
    toast({ description: "Note updated." });
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
    toast({ description: "Note deleted." });
  };
  
  const deleteAllNotes = () => {
    setNotes((prev) => prev.filter((_, index) => index === 0));
    toast({ description: "All Notes deleted." });
  };

  return { notes, setNotes, addNote, updateNote, deleteNote, deleteAllNotes };
};
