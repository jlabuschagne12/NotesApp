import { useSessionStorage, useDebounce } from "@uidotdev/usehooks";
import { useEffect, useState, useRef } from "react";
import "./App.css";
import { Note, NavBar, NoteStack } from "./components";
import { calculatePositions } from "./lib/appUtils";
import { useNotes, useDrag, useSort } from "./hooks";

const App = () => {
  // Persistent state for notes, layout, and user preferences
  const [positions, setPositions] = useSessionStorage<{ x: number; y: number }[]>("positions", []);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [colorIndex, setColorIndex] = useSessionStorage<number>("colorIndex", 0);
  const [sizeFactor, setSizeFactor] = useSessionStorage<number>("sizeFactor", 10);
  const [cellWidth, setCellWidth] = useSessionStorage<number>("cellWidth", 200);
  const containerRef = useRef<HTMLDivElement>(null);

  const { notes, setNotes, addNote, updateNote, deleteNote, deleteAllNotes } = useNotes(colorIndex);
  const { onDragStart, onDragOver, onDrop } = useDrag(setNotes);
  const { sort, setSort } = useSort(notes, setNotes, "");
  
  // Debounced width to optimize resizing performance
  const debouncedWidth = useDebounce(containerWidth, 100);

  // Add an initial note if none exist
  useEffect(() => {
    if (notes.length < 1) addNote();
  }, [notes, addNote]);

  // Change color of the first note
  const changeColor = (index: number) => {
    setColorIndex(index);
    setNotes((prev) =>
      prev.map((note, ind) => (ind < 1 ? { ...note, colorIndex: index } : note))
    );
  };

  // Recalculate positions for notes based on container width
  const recalculatePositions = (width: number) => {
    setPositions(calculatePositions(notes, width, cellWidth));
  };

  // Update container width on resize
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };

    window.addEventListener("resize", updateWidth);
    updateWidth();

    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Recalculate note positions when container width or notes change
  useEffect(() => {
    recalculatePositions(debouncedWidth);
  }, [debouncedWidth, notes]);

  return (
    <div className="h-screen flex flex-col">
      {/* Navigation bar for user controls */}
      <NavBar 
        sizeFactor={sizeFactor} 
        onSizeFactorChange={setSizeFactor} 
        cellWidth={cellWidth} 
        onWidthChange={setCellWidth}
        sort={sort}
        onSortChange={setSort}
        deleteAllNotes={deleteAllNotes}
        notesLength={notes.length}
      />
      <div ref={containerRef} className="relative grow m-8 overflow-auto">
        {/* Stack of notes for styling */}
        <NoteStack colorIndex={colorIndex} stackNumber={10} notesTotal={notes.length} sizeFactor={sizeFactor} />
        {/* Render each note */}
        {notes.map((note, index) => (
          <Note
            key={note.id}
            index={index}
            {...note}
            sizeFactor={sizeFactor}
            position={positions[index] || { x: 0, y: 0 }}
            onDragStart={(e) => onDragStart(e, index)}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, index)}
            updateNote={updateNote}
            deleteNote={deleteNote}
            handleAddNote={addNote}
            handleColorSelected={changeColor}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
