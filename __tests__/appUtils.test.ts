import { describe, it, expect } from "vitest";
import {
  sortNotesAlpha,
  sortNotesByTime,
  areNotesSorted,
  calculatePositions,
} from "@/lib/appUtils"; // Update the import path as needed
import { NoteType } from "@/types";

describe("Utility Functions", () => {
  const mockNotes: NoteType[] = [
    {
      title: "Pinned Note",
      updatedAt: "2024-01-01T10:00:00Z",
      body: "",
      id: "0",
      colorIndex: 0,
    },
    {
      title: "Delta Note",
      updatedAt: "2024-01-03T10:00:00Z",
      body: "",
      id: "3",
      colorIndex: 0,
    },
    {
      title: "Alpha Note",
      updatedAt: "2024-01-04T10:00:00Z",
      body: "",
      id: "1",
      colorIndex: 0,
    },
    {
      title: "Beta Note",
      updatedAt: "2024-01-02T10:00:00Z",
      body: "",
      id: "2",
      colorIndex: 0,
    },
  ];

  describe("sortNotesAlpha", () => {
    it("should sort notes alphabetically in ascending order, keeping the first note exempt", () => {
      const result = sortNotesAlpha(mockNotes, true);
      expect(result[0].title).toBe("Pinned Note");
      expect(result[1].title).toBe("Alpha Note");
      expect(result[2].title).toBe("Beta Note");
      expect(result[3].title).toBe("Delta Note");
    });

    it("should sort notes alphabetically in descending order, keeping the first note exempt", () => {
      const result = sortNotesAlpha(mockNotes, false);
      expect(result[0].title).toBe("Pinned Note");
      expect(result[1].title).toBe("Delta Note");
      expect(result[2].title).toBe("Beta Note");
      expect(result[3].title).toBe("Alpha Note");
    });
  });

  describe("sortNotesByTime", () => {
    it("should sort notes by updated time in ascending order, keeping the first note exempt", () => {
      const result = sortNotesByTime(mockNotes, true);
      expect(result[0].title).toBe("Pinned Note");
      expect(result[1].title).toBe("Beta Note");
      expect(result[2].title).toBe("Delta Note");
      expect(result[3].title).toBe("Alpha Note");
    });

    it("should sort notes by updated time in descending order, keeping the first note exempt", () => {
      const result = sortNotesByTime(mockNotes, false);
      expect(result[0].title).toBe("Pinned Note");
      expect(result[1].title).toBe("Alpha Note");
      expect(result[2].title).toBe("Delta Note");
      expect(result[3].title).toBe("Beta Note");
    });
  });

  describe("areNotesSorted", () => {
    const alphaCompare = (a: NoteType, b: NoteType) =>
      a.title.localeCompare(b.title);
    const timeCompare = (a: NoteType, b: NoteType) =>
      new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();

    it("should return false for unsorted notes (alphabetically)", () => {
      expect(areNotesSorted(mockNotes, alphaCompare, true)).toBe(false);
    });

    it("should return true for alphabetically sorted notes (ascending)", () => {
      const sortedNotes = sortNotesAlpha(mockNotes, true);
      expect(areNotesSorted(sortedNotes, alphaCompare, true)).toBe(true);
    });

    it("should return false for unsorted notes (by time)", () => {
      expect(areNotesSorted(mockNotes, timeCompare, true)).toBe(false);
    });

    it("should return true for time-sorted notes (ascending)", () => {
      const sortedNotes = sortNotesByTime(mockNotes, true);
      expect(areNotesSorted(sortedNotes, timeCompare, true)).toBe(true);
    });
  });

  describe("calculatePositions", () => {
    it("should calculate positions for notes based on container width and cell width", () => {
      const width = 1540; // Container width
      const cellWidth = 400; // Note cell width
      const result = calculatePositions(mockNotes, width, cellWidth);

      expect(result).toHaveLength(mockNotes.length);
      expect(result).toEqual([
        { x: 0, y: 0 }, // First note
        { x: 570, y: 0 }, // Second note (gap = 25)
        { x: 1140, y: 0 }, // Third note
        { x: 0, y: 400 }, // Third note
      ]);
    });

    it("should handle cases where the container width only fits one column", () => {
      const width = 100; // Container width fits only one column
      const cellWidth = 100;
      const result = calculatePositions(mockNotes, width, cellWidth);

      expect(result).toEqual([
        { x: 0, y: 0 }, // First note
        { x: 0, y: 100 }, // Second note
        { x: 0, y: 200 }, // Third note
        { x: 0, y: 300 }, // Fourth note
      ]);
    });
  });
});
