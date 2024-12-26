import { useDebounce, useLocalStorage } from "@uidotdev/usehooks";
import { useEffect, useState, useRef } from "react";
import "./App.css";
import { Note, TopBar, NoteStack } from "./components";
import { calculatePositions } from "./lib/appUtils";
import { useNotes } from "./hooks";

const App = () => {
  // Persistent state for layout, and user preferences
  const [positions, setPositions] = useLocalStorage<{ x: number; y: number }[]>("positions", []);
  const [containerWidth, setContainerWidth] = useState(0);
  const [sizeFactor, setSizeFactor] = useLocalStorage("sizeFactor", 10);
  const [cellWidth, setCellWidth] = useLocalStorage("cellWidth", 200);
  const containerRef = useRef<HTMLDivElement>(null);

  const { notes } = useNotes();
  
  // Debounced width to optimize resizing performance
  const debouncedWidth = useDebounce(containerWidth, 100);

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
  }, [containerRef]);

  useEffect(() => {
      // Recalculate positions for notes based on container width
    const recalculatePositions = (width: number) => {
      setPositions(calculatePositions(notes, width, cellWidth));
    };

    recalculatePositions(debouncedWidth);
  }, [debouncedWidth, notes, cellWidth, setPositions]);

  return (
    <div className="h-screen flex flex-col">
      {/* Navigation bar for user controls */}
      <TopBar sizeFactor={sizeFactor} onSizeFactorChange={setSizeFactor} cellWidth={cellWidth} onWidthChange={setCellWidth}
      />
      <div ref={containerRef} className="relative grow m-8 overflow-auto">
        {/* Stack of notes for styling */}
        <NoteStack colorIndex={notes[0].colorIndex} stackNumber={10} notesTotal={notes.length} sizeFactor={sizeFactor} />
        {/* Render each note */}
        {notes.map((note, index) => (
          <Note
            key={note.id}
            index={index}
            {...note}
            sizeFactor={sizeFactor}
            position={positions[index] || { x: 0, y: 0 }}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
