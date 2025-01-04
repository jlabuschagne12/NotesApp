import { render as rtlRender, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TooltipProvider } from "@/components/ui/tooltip";
import App from "./App"; // Adjust the import to your project structure
import { describe, test, expect, beforeEach } from "vitest";

const render = (ui: React.ReactElement) => {
  return rtlRender(<TooltipProvider>{ui}</TooltipProvider>);
};

beforeEach(() => {
  localStorage.clear();
});

describe("App Component Integration Tests", () => {
  test("renders an initial note", async () => {
    render(<App />);

    // Wait for notes to appear
    const noteElements = await screen.findAllByPlaceholderText(/Add title/i);
    expect(noteElements.length).toBe(1);

    // Verify content of the first note
    expect(noteElements[0]).toHaveValue("");
  });

  test("Disables adding a new note with no title", async () => {
    render(<App />);

    // Find input and add button
    const addButton = screen.getByRole("button", {
      name: /add/i,
    });

    // Try to add a new note
    await userEvent.click(addButton);

    // Verify that there remains only the intial note
    const noteElements = await screen.findAllByPlaceholderText(/Add title/i);
    expect(noteElements.length).toBe(1);
  });

  test("Allows new note to be added", async () => {
    render(<App />);

    // Add a new note
    await addNotes(["New Note"]);

    // Verify the new note is added to the list
    const newNote = await screen.findByDisplayValue(/New Note/i);
    expect(newNote).toBeInTheDocument();
  });

  test("Allows notes to be added and deleted", async () => {
    render(<App />);

    // Add notes
    await addNotes(["A - Note", "B - Note", "C - Note", "D - Note"]);

    // Check all notes were added
    let notes = screen.getAllByPlaceholderText(/Add title/i);
    expect(notes.length).toBe(5);

    // Get and click all delete buttons
    const deleteButtons = await screen.findAllByRole("button", {
      name: /delete/i,
    });

    for (const button of deleteButtons) {
      await userEvent.click(button);
    }

    // Reassign notes to get the latest total
    notes = screen.getAllByPlaceholderText(/Add title/i);
    // Verify there is only the blank note left
    expect(notes.length).toBe(1);
  });

  test("Allows all notes to be deleted with delete all button", async () => {
    render(<App />);

    // Add notes
    await addNotes(["A - Note", "B - Note", "C - Note", "D - Note"]);

    // Check all notes were added
    let notes = screen.getAllByPlaceholderText(/Add title/i);
    expect(notes.length).toBe(5);

    // Get and click delete all button
    const deleteButtons = await screen.findByRole("button", {
      name: /deleteAll/i,
    });

    await userEvent.click(deleteButtons);

    // Reassign notes to get the latest total
    notes = screen.getAllByPlaceholderText(/Add title/i);
    // Verify there is only the blank note left
    expect(notes.length).toBe(1);
  });

  test("Sort alphabetically ascending", async () => {
    render(<App />);

    // Add notes
    await addNotes(["B", "C", "A", "D"]);

    // Timeout crucial to allow 2 second debounced state setter to update global state
    await new Promise((resolve) => setTimeout(resolve, 2200));

    // Get all note input elements
    let titleInputs = await screen.findAllByPlaceholderText(/Add title/i);

    // Make an array of values
    let values = titleInputs.map((titleInput) =>
      titleInput.getAttribute("value")
    );

    // Ensure initial values are in expected order
    expect(values).toStrictEqual(["", "D", "A", "C", "B"]);

    // Get sort alph asc button
    const alphAsc = await screen.findByRole("button", {
      name: /sortAlphAsc/i,
    });

    // Click alph asc button
    await userEvent.click(alphAsc);

    // Reassign titleInputs to new order
    titleInputs = await screen.findAllByPlaceholderText(/Add title/i);

    // Reassign array of values
    values = titleInputs.map((titleInput) => titleInput.getAttribute("value"));

    expect(values).toStrictEqual(["", "A", "B", "C", "D"]);
  });

  test("Sort alphabetically descending", async () => {
    render(<App />);

    // Add notes
    await addNotes(["B", "C", "A", "D"]);

    // Timeout crucial to allow 2 second debounced state setter to update global state
    await new Promise((resolve) => setTimeout(resolve, 2200));

    // Get all note input elements
    let titleInputs = await screen.findAllByPlaceholderText(/Add title/i);

    // Make an array of values
    let values = titleInputs.map((titleInput) =>
      titleInput.getAttribute("value")
    );

    // Ensure initial values are in expected order
    expect(values).toStrictEqual(["", "D", "A", "C", "B"]);

    // Get sort alph des button
    const alphDes = await screen.findByRole("button", {
      name: /sortAlphDes/i,
    });

    // Click alph des button
    await userEvent.click(alphDes);

    // Reassign titleInputs to new order
    titleInputs = await screen.findAllByPlaceholderText(/Add title/i);

    // Reassign array of values
    values = titleInputs.map((titleInput) => titleInput.getAttribute("value"));

    expect(values).toStrictEqual(["", "D", "C", "B", "A"]);
  });

  test("Sort time ascending", async () => {
    render(<App />);

    // Add notes
    await addNotes(["1st", "2nd", "3rd", "4th"]);

    // Timeout crucial to allow 2 second debounced state setter to update global state
    await new Promise((resolve) => setTimeout(resolve, 2200));

    // Get all note input elements
    let titleInputs = await screen.findAllByPlaceholderText(/Add title/i);

    // Make an array of values
    let values = titleInputs.map((titleInput) =>
      titleInput.getAttribute("value")
    );

    // Ensure initial values are in expected order
    expect(values).toStrictEqual(["", "4th", "3rd", "2nd", "1st"]);

    // Get sort time asc button
    const timeAsc = await screen.findByRole("button", {
      name: /sortTimeAsc/i,
    });

    // Click time asc button
    await userEvent.click(timeAsc);

    // Reassign titleInputs to new order
    titleInputs = await screen.findAllByPlaceholderText(/Add title/i);

    // Reassign array of values
    values = titleInputs.map((titleInput) => titleInput.getAttribute("value"));

    expect(values).toStrictEqual(["", "1st", "2nd", "3rd", "4th"]);
  });

  test("Sort time descending", async () => {
    render(<App />);

    // Add notes
    await addNotes(["1st", "2nd", "3rd", "4th"]);

    // Timeout crucial to allow 2 second debounced state setter to update global state
    await new Promise((resolve) => setTimeout(resolve, 2200));

    // Get all note input elements
    let titleInputs = await screen.findAllByPlaceholderText(/Add title/i);

    // Make an array of values
    let values = titleInputs.map((titleInput) =>
      titleInput.getAttribute("value")
    );

    // Ensure initial values are in expected order
    expect(values).toStrictEqual(["", "4th", "3rd", "2nd", "1st"]);

    // Get sort time des button
    const timeDes = await screen.findByRole("button", {
      name: /sortTimeDes/i,
    });

    // Click time des button
    await userEvent.click(timeDes);

    // Reassign titleInputs to new order
    titleInputs = await screen.findAllByPlaceholderText(/Add title/i);

    // Reassign array of values
    values = titleInputs.map((titleInput) => titleInput.getAttribute("value"));

    expect(values).toStrictEqual(["", "4th", "3rd", "2nd", "1st"]);
  });
});

const addNotes = async (noteTitles: string[]) => {
  for (const noteTitle of noteTitles) {
    // Need to redeclare add button on every loop as it gets reproduced on each note add
    const addButton = screen.getByRole("button", { name: /add/i });
    // Using getAllByPlaceholderText to get all title inputs and select the first one
    const titleInputs = screen.getAllByPlaceholderText(/Add title/i);
    await userEvent.type(titleInputs[0], noteTitle);
    await userEvent.click(addButton);
  }
};
