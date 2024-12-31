import React, { useEffect, useState, useRef } from "react";
import { Input, Button } from "@/components/ui";
import { Textarea } from "@/components/ui/textarea";
import { Trash, Plus, Clock8 } from "lucide-react";
import { IconTooltip } from "./IconButtons";
import { NoteType } from "@/types";
import { colors } from "@/constants";
import { useDebounce } from "@uidotdev/usehooks";
import { useNotes, useDrag } from "../hooks";
import { cn } from "@/lib/utils";

type NoteProps = {
  index: number;
  id: string;
  title: string;
  body: string;
  colorIndex: number;
  sizeFactor: number;
  updatedAt: string;
  position: { x: number; y: number };
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
}: NoteProps) => {
  const { notes, setNotes, addNote, updateNote, deleteNote } = useNotes();
  const { onDragStart, onDragOver, onDrop } = useDrag();

  const [style, setStyle] = useState({
    transform: `translate(0px, 0px) scale(${sizeFactor / 10})`,
  });

  const [localTitle, setLocalTitle] = useState(title);
  const [localBody, setLocalBody] = useState(body);

  const [titleError, setTitleError] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedTitle = useDebounce(localTitle, 2000);
  const debouncedBody = useDebounce(localBody, 2000);

  useEffect(() => {
    if (inputRef.current && index === 0) inputRef.current.focus();
  }, [index]);

  useEffect(() => {
    if (localTitle.length > 0) setTitleError(false);
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
      transform: `translate(${position.x}px, ${position.y}px) scale(${
        sizeFactor / 10
      })`,
    });
  }, [position, sizeFactor]);

  const updateLocalTitle = (e: React.ChangeEvent<HTMLInputElement>) =>
    setLocalTitle(e.target.value);

  const updateLocalBody = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const str = e.target.value;
    if (str.length <= 140) setLocalBody(str);
  };

  const addNoteClicked = () => {
    if (localTitle.length < 1) return setTitleError(true);
    addNote();
  };

  const changeColor = (index: number) =>
    setNotes(
      notes.map((note, ind) =>
        ind < 1 ? { ...note, colorIndex: index } : note
      )
    );

  return (
    <div
      draggable={index > 0}
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, index)}
      className="h-48 w-48 absolute border rounded-xl shadow transition-transform duration-300 ease-in-out flex flex-col bg-background"
      style={{
        ...style,
        borderColor: colors[colorIndex],
        transformOrigin: "0 0",
      }}
      title="noteShell"
    >
      <div>
        <div className="h-8 flex w-full justify-between p-1.5">
          <div
            className={`flex items-center gap-1.5 px-1.5 grow ${
              index > 0 && "cursor-grab"
            }`}
          >
            {index < 1 ? (
              colors.map((color, index) => (
                <button
                  key={index}
                  onClick={() => changeColor(index)}
                  className={cn(
                    `h-3 w-3 rounded-full color-${color}`,
                    index === colorIndex && "border-2 border-ring"
                  )}
                  style={{
                    backgroundColor: color,
                  }}
                  title="colorButton"
                />
              ))
            ) : (
              <IconTooltip
                tooltipText={`Last updated: ${new Date(
                  updatedAt
                ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}`}
              >
                <Clock8 className="text-muted-foreground" size={14} />
              </IconTooltip>
            )}
          </div>
          {index < 1 ? (
            <IconTooltip tooltipText="Add Note">
              <Button
                onClick={addNoteClicked}
                variant="ghost"
                size="iconSmall"
                title="addNote"
              >
                <Plus />
              </Button>
            </IconTooltip>
          ) : (
            <IconTooltip tooltipText="Delete Note">
              <Button
                onClick={() => deleteNote(id)}
                variant="ghost"
                size="iconSmall"
                title="deleteNote"
              >
                <Trash />
              </Button>
            </IconTooltip>
          )}
        </div>
        <Input
          ref={inputRef}
          className={cn(
            "border-0 border-b border-input rounded-none focus-visible:ring-0 focus-visible:border-b-2",
            titleError
              ? "focus-visible:border-red-500 border-red-500/90"
              : "focus-visible:border-ring"
          )}
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
      {localBody.length >= 132 && (
        <span
          className={cn(
            "absolute text-xs bottom-2 right-2",
            localBody.length >= 136 ? "text-red-300" : "text-muted-foreground"
          )}
        >
          {localBody.length}/140
        </span>
      )}
    </div>
  );
};

export default Note;
