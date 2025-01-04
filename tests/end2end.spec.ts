import { test, expect, type Page } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("localhost:5173/");
});

test("page has correct title", async ({ page }) => {
  const title = await page.title();
  expect(title).toBe("ClearScore style notes app");
});

const NOTE_TITLES = [
  "Banal title",
  "A basic title",
  "Certainly a simple title",
];

test.describe("New Note", () => {
  test("should allow me to add notes", async ({ page }) => {
    // Create 1st note.
    let noteTitleInputs = page.locator('input[placeholder="Add title"]');
    await noteTitleInputs.nth(0).fill(NOTE_TITLES[0]);

    let noteAddButton = page.getByTitle("addNote");
    await noteAddButton.click();

    // Make sure the list only has two notes (starter note and recently added note).
    noteTitleInputs = page.locator('input[placeholder="Add title"]');
    let noteCount = await noteTitleInputs.count();
    expect(noteCount).toBe(2);

    // Ensure first note is empty (starter note) and second note (recently added) has correct title text.
    expect(await noteTitleInputs.nth(0).inputValue()).toBe("");
    expect(await noteTitleInputs.nth(1).inputValue()).toBe(NOTE_TITLES[0]);

    // Create 2nd note.
    noteTitleInputs = page.locator('input[placeholder="Add title"]');
    await noteTitleInputs.nth(0).fill(NOTE_TITLES[1]);

    noteAddButton = page.getByTitle("addNote");
    await noteAddButton.click();

    // Create 3rd note.
    noteTitleInputs = page.locator('input[placeholder="Add title"]');
    await noteTitleInputs.nth(0).fill(NOTE_TITLES[2]);

    noteAddButton = page.getByTitle("addNote");
    await noteAddButton.click();

    // Make sure the list now has four notes.
    noteTitleInputs = page.locator('input[placeholder="Add title"]');
    noteCount = await noteTitleInputs.count();
    expect(noteCount).toBe(4);

    for (let i = 1; i < noteCount; i++) {
      const NOTE_TITLES_IN_ORDER_OF_CREATION = [...NOTE_TITLES].reverse();
      const value = await noteTitleInputs.nth(i).inputValue();
      expect(value).toBe(NOTE_TITLES_IN_ORDER_OF_CREATION[i - 1]);
    }

    // Make sure localStorage holds four notes.
    await checkNumberOfTodosInLocalStorage(page, 4);
  });

  test("notes should have correctly assigned colors", async ({ page }) => {
    // Create three new notes.
    await createDefaultTodosWithIndividualColors(page);

    const noteShells = page.locator('div[title="noteShell"]');

    const noteColorButtons = page.locator('button[title="colorButton"]');

    for (let i = 0; i < (await noteShells.count()); i++) {
      const borderColor = await noteShells.nth(i).evaluate((el) => {
        return window.getComputedStyle(el).borderColor; // Retrieve the computed border color
      });
      const buttonColor = await noteColorButtons
        .nth(NOTE_TITLES.length - i)
        .evaluate((el) => {
          return window.getComputedStyle(el).backgroundColor;
        });

      expect(borderColor).toBe(buttonColor);
    }
  });
});

test.describe("Delete Notes", () => {
  test("should allow me to delete one note at a time", async ({ page }) => {
    await createDefaultTodosWithIndividualColors(page);

    const deleteNoteButtons = page.locator('button[title="deleteNote"]');
    const deleteNoteButtonsLength = await deleteNoteButtons.count();

    for (let i = 0; i < deleteNoteButtonsLength; i++) {
      await deleteNoteButtons.nth(deleteNoteButtonsLength - 1 - i).click();
      expect(await deleteNoteButtons.count()).toBe(
        deleteNoteButtonsLength - 1 - i
      );
    }
  });

  test("should allow me to delete all notes", async ({ page }) => {
    await createDefaultTodosWithIndividualColors(page);
    let initialNotesLength = await page
      .locator('div[title="noteShell"]')
      .count();

    expect(initialNotesLength).toBe(NOTE_TITLES.length + 1);

    const deleteAllNotesButton = page.getByTitle("deleteAllNotes");

    await deleteAllNotesButton.click();

    initialNotesLength = await page.locator('div[title="noteShell"]').count();

    expect(initialNotesLength).toBe(1);
  });
});

test.describe("Sort Notes", () => {
  test("should sort notes alphabetically ascending", async ({ page }) => {
    await addNotes(page, ["B", "C", "A", "D"]);

    await page.waitForTimeout(3000);

    const currValues = await page
      .locator('input[placeholder="Add title"]')
      .evaluateAll((elements) =>
        elements.map((el) => (el as HTMLInputElement).value)
      );

    expect(currValues).toStrictEqual(["", "D", "A", "C", "B"]);

    const sortButton = page.getByRole("button", { name: "sortAlphAsc" });

    await sortButton.click();

    const newValues = await page
      .locator('input[placeholder="Add title"]')
      .evaluateAll((elements) =>
        elements.map((el) => (el as HTMLInputElement).value)
      );

    console.log(newValues);

    expect(newValues).toStrictEqual(["", "A", "B", "C", "D"]);
  });
  // test("should sort notes alphabetically descending", async ({ page }) => {
  // });
  test("should sort notes by time ascending", async ({ page }) => {
    await addNotes(page, ["1st", "2nd", "3rd", "4th"]);

    await page.waitForTimeout(3000);

    const currValues = await page
      .locator('input[placeholder="Add title"]')
      .evaluateAll((elements) =>
        elements.map((el) => (el as HTMLInputElement).value)
      );

    expect(currValues).toStrictEqual(["", "4th", "3rd", "2nd", "1st"]);

    const sortButton = page.getByRole("button", { name: "sortTimeAsc" });

    await sortButton.click();

    const newValues = await page
      .locator('input[placeholder="Add title"]')
      .evaluateAll((elements) =>
        elements.map((el) => (el as HTMLInputElement).value)
      );

    console.log(newValues);

    expect(newValues).toStrictEqual(["", "4th", "3rd", "2nd", "1st"]);
  });
  // test("should sort notes by time descending", async ({ page }) => {
  // });
});

async function checkNumberOfTodosInLocalStorage(page: Page, expected: number) {
  return await page.waitForFunction((e) => {
    return JSON.parse(localStorage["notes"]).length === e;
  }, expected);
}

async function createDefaultTodosWithIndividualColors(page: Page) {
  for (let i = 0; i < NOTE_TITLES.length; i++) {
    const noteTitleInput = page
      .locator('input[placeholder="Add title"]')
      .first();
    await noteTitleInput.nth(0).fill(NOTE_TITLES[i]);

    const noteColorButtons = await page.getByLabel("colorButton").all();
    await noteColorButtons[i].click();

    const noteAddButton = page.getByRole("button", { name: "add" });
    await noteAddButton.click();
  }
  const noteColorButtons = await page.getByLabel("colorButton").all();
  await noteColorButtons[NOTE_TITLES.length].click();
}

const addNotes = async (page: Page, noteTitles: string[]) => {
  for (const noteTitle of noteTitles) {
    // Need to redeclare add button on every loop as it gets reproduced on each note add
    const addButton = page.getByRole("button", { name: /add/i });
    // Using getAllByPlaceholderText to select first one
    const titleInput = page.locator('input[placeholder="Add title"]').first();
    await titleInput.fill(noteTitle);
    await addButton.click();
  }
};
