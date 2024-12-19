import React from "react";
import {render, screen, fireEvent, } from "@testing-library/react"
import userEvent from "@testing-library/user-event";
import {
  TooltipProvider,
} from "@/components/ui/tooltip"
import { expect, it } from "vitest";

import App from "../App";

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <TooltipProvider>
      {ui}
    </TooltipProvider>
  );
};

it("renders the application with an initial note", () => {
  renderWithProviders(<App />);

  // Ensure the initial note is rendered
  const noteTitleInput = screen.getByPlaceholderText("Add title");
  expect(noteTitleInput).toBeVisible();
});

it("adds a new note without title", async () => {
  renderWithProviders(<App />);
  const addButton = screen.getByRole("addNote");

  // Simulate clicking the add button
  fireEvent.click(addButton);

  const notes = screen.getAllByPlaceholderText("Add title");

  // Check if a second note is rendered
  expect(notes.length).toBe(1);
});

it("adds a new note with title", async () => {
  renderWithProviders(<App />);
  const addButton = screen.getByRole("addNote");
  let notes = screen.getAllByPlaceholderText("Add title");

  const firstNoteTitleInput = notes[0];
  await userEvent.type(firstNoteTitleInput, "a");

  // Simulate clicking the add button
  fireEvent.click(addButton);

  notes = screen.getAllByPlaceholderText("Add title");

  // Check if a second note is rendered
  expect(notes.length).toBe(2);
});

it("updates the title of a note", async () => {
  renderWithProviders(<App />);
  const notes = screen.getAllByPlaceholderText("Add title");
  const noteTitleInput = notes[0];

  // Simulate typing into the title input
  await userEvent.type(noteTitleInput, "Updated Note")

  expect(noteTitleInput).toHaveValue("Updated Note");
});

it("deletes a note", async () => {
  renderWithProviders(<App />);

  const addButton = screen.getByRole("addNote");
  let notes = screen.getAllByPlaceholderText("Add title");

  const firstNoteTitleInput = notes[0];
  await userEvent.type(firstNoteTitleInput, "a");

  // Simulate clicking the add button
  fireEvent.click(addButton);

  notes = screen.getAllByPlaceholderText("Add title");
  const originalLength = Number(notes.length)

  const deleteButtons = screen.getAllByRole("deleteNote");

  // Simulate clicking the delete button
  fireEvent.click(deleteButtons[0]);

  // Ensure no notes remain
  notes = screen.queryAllByPlaceholderText("Add title");
  expect(notes.length).toBe(originalLength - 1);
});
