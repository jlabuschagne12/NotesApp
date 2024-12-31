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
    await createDefaultTodosWithIndividualColors(page);

    const sortButton = page.getByTitle("sortAlphAscBtn");
    await sortButton.click();

    //
    // NOTHING HAPPENS AFTER SORT BUTTON IS CLICKED
    //

    const noteTitleInputs = page.locator('input[placeholder="Add title"]');
    const noteTitles = [];
    for (let i = 0; i < (await noteTitleInputs.count()); i++) {
      noteTitles.push(await noteTitleInputs.nth(i).inputValue());
    }

    console.log(noteTitles);

    const expectedTitles = [...NOTE_TITLES].sort((a, b) => a.localeCompare(b));
    expect(noteTitles.slice(1)).toEqual(expectedTitles);
  });
  // test("should sort notes alphabetically descending", async ({ page }) => {
  // });
  // test("should sort notes by time ascending", async ({ page }) => {
  // });
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

    const noteColorButtons = page.locator('button[title="colorButton"]');
    await noteColorButtons.nth(i).click();

    const noteAddButton = page.getByTitle("addNote");
    await noteAddButton.click();
  }
  const noteColorButtons = page.locator('button[title="colorButton"]');
  await noteColorButtons.nth(NOTE_TITLES.length).click();
}
