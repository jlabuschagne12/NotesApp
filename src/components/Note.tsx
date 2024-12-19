import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui'
import { Textarea } from "@/components/ui/textarea"
import { LastUpdatedIcon, AddNoteButton, DeleteNoteButton } from './IconButtons';
import { NoteType } from "@/types";
import { colors } from '@/constants';
import { useDebounce } from "@uidotdev/usehooks";

type NoteProps = {
  index: number;
  id: string;
  title: string;
  body: string;
  colorIndex: number;
  sizeFactor: number;
  updatedAt: string;
  position: { x: number; y: number };
  onDragStart: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  updateNote: (id: string, updates: Partial<NoteType>) => void;
  deleteNote: (id: string) => void;
  handleAddNote: () => void;
  handleColorSelected: (index: number) => void;
};

export const Note = ({
  index,
  id,
  title,
  body,
  colorIndex,
  sizeFactor,
  updatedAt,
  position,
  onDragStart,
  onDragOver,
  onDrop,
  updateNote,
  deleteNote,
  handleAddNote,
  handleColorSelected
}: NoteProps) => {
  const [style, setStyle] = useState({ transform: `translate(0px, 0px) scale(${sizeFactor/10})` });

  const [localTitle, setLocalTitle] = useState(title);
  const [localBody, setLocalBody] = useState(body);
  
  const [titleError, setTitleError] = useState<boolean>(false);

  const debouncedTitle = useDebounce(localTitle, 2000);
  const debouncedBody = useDebounce(localBody, 2000);

  useEffect(() => {
    if (localTitle.length > 0) setTitleError(false)
  }, [localTitle]);

  useEffect(() => {
    const updates: Partial<NoteType> = {};
    if (debouncedTitle !== title) updates.title = debouncedTitle;
    if (debouncedBody !== body) updates.body = debouncedBody;

    if (Object.keys(updates).length > 0) {
      updateNote(id, updates);
    }
  }, [debouncedTitle, debouncedBody, title, body, id, updateNote]);

  useEffect(() => {
    setStyle({
      transform: `translate(${position.x}px, ${position.y}px) scale(${sizeFactor/10})`,
    });
  }, [position, sizeFactor]);

  const updateLocalTitle = (e: any) => setLocalTitle(e.target.value)

  const updateLocalBody = (e: any) => {
    const str = e.target.value
    if (str.length <= 140) setLocalBody(str);
  }

  const addNoteClicked = () => {
    if (localTitle.length < 1) return setTitleError(true)
    handleAddNote()
  }

  return (
    <div
      draggable={index > 0}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className="h-48 w-48 absolute border rounded-xl shadow transition-transform duration-300 ease-in-out flex flex-col bg-background"
      style={{...style, borderColor: colors[colorIndex], transformOrigin: "0 0",}}
    >
      <div >
        <div className='h-8 flex w-full justify-between p-1.5'>
          <div className={`flex items-center gap-1.5 px-1.5 grow ${index > 0 && "cursor-grab"}`}>
            {index < 1 ? (
              colors.map((color, index) => (
                <button key={index} onClick={() => handleColorSelected(index)} className={`h-3 w-3 rounded-full ${index === colorIndex && "border-2 border-ring"}`} style={{
                  backgroundColor: color
                }}/>
              ))
            ) : (
              <LastUpdatedIcon updatedAt={updatedAt} />
            )}
          </div>
          {index < 1 ? (
            <AddNoteButton handleAddNote={addNoteClicked} />
          ) : (
            <DeleteNoteButton deleteNote={deleteNote} id={id} />
          )}
        </div>
        <Input 
          className={`border-0 border-b border-input rounded-none focus-visible:ring-0 focus-visible:border-b-2 ${titleError ? "focus-visible:border-red-500 border-red-500/90" : "focus-visible:border-ring" }`}
          value={localTitle}
          onChange={updateLocalTitle}
          placeholder="Add title"
        />
      </div>
      <Textarea 
        className="resize-none rounded-t-none grow border-none text-sm relative rounded-b-xl"
        value={localBody}
        onChange={updateLocalBody}
        placeholder="Add body"
      />
      {localBody.length >= 132 &&
        <span className={`absolute text-xs text-muted-foreground bottom-2 right-2 ${localBody.length >= 136 ? "text-red-300" : "text-muted-foreground"}`}>{localBody.length}/140</span>
      }
    </div>
  )
}

export default Note

