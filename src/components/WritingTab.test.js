import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import WritingTab from "./WritingTab";
import { getWritingFeedback } from "../utils/anthropic";
import db from "../utils/db";

jest.mock("../utils/anthropic");
jest.mock("../utils/db");

describe("WritingTab", () => {
  const mockJournalEntries = [
    {
      id: 1,
      content: "Test entry 1",
      prompt: "Test prompt 1",
      date: "2023-05-01T00:00:00.000Z",
      wordCount: 3,
    },
    {
      id: 2,
      content: "Test entry 2",
      prompt: "Test prompt 2",
      date: "2023-05-02T00:00:00.000Z",
      wordCount: 3,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    db.journalEntries.toArray.mockResolvedValue(mockJournalEntries);
    db.customPrompts.toArray.mockResolvedValue([]);
  });

  test("renders WritingTab component", async () => {
    render(<WritingTab journalEntries={[]} setJournalEntries={() => {}} />);

    await screen.findByText("Daily Writing Practice");
    await screen.findByText("Today's Prompt:");
    await screen.findByPlaceholderText("Write your response here...");
    await screen.findByText("Save Entry");
  });

  test("saves a new journal entry", async () => {
    const setJournalEntries = jest.fn();
    render(
      <WritingTab
        journalEntries={mockJournalEntries}
        setJournalEntries={setJournalEntries}
      />
    );

    const textarea = screen.getByPlaceholderText("Write your response here...");
    fireEvent.change(textarea, { target: { value: "New test entry" } });

    const saveButton = screen.getByText("Save Entry");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(db.journalEntries.add).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(setJournalEntries).toHaveBeenCalled();
    });
  });

  test("displays journal entries and allows selection", async () => {
    render(
      <WritingTab
        journalEntries={mockJournalEntries}
        setJournalEntries={() => {}}
      />
    );

    await waitFor(() => {
      expect(screen.getByText("Number of entries: 2")).toBeInTheDocument();
    });

    const selectTrigger = screen.getByText("Select an entry to review");
    fireEvent.click(selectTrigger);

    await waitFor(() => {
      expect(screen.getByText(/05\/01\/2023.*3 words/)).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText(/05\/02\/2023.*3 words/)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/05\/01\/2023.*3 words/));

    await waitFor(() => {
      expect(screen.getByText("Test entry 1")).toBeInTheDocument();
    });
  });

  test("processes feedback for a selected entry", async () => {
    getWritingFeedback.mockResolvedValue({ overallFeedback: "Good job!" });

    render(
      <WritingTab
        journalEntries={mockJournalEntries}
        setJournalEntries={() => {}}
      />
    );

    const selectTrigger = screen.getByText("Select an entry to review");
    fireEvent.click(selectTrigger);
    fireEvent.click(screen.getByText(/05\/01\/2023.*3 words/));

    const getFeedbackButton = screen.getByText("Get Feedback");
    fireEvent.click(getFeedbackButton);

    await waitFor(() => {
      expect(getWritingFeedback).toHaveBeenCalledWith("Test entry 1");
    });

    await waitFor(() => {
      expect(screen.getByText("Good job!")).toBeInTheDocument();
    });
  });

  test("adds a custom prompt", async () => {
    render(
      <WritingTab
        journalEntries={mockJournalEntries}
        setJournalEntries={() => {}}
      />
    );

    const customPromptInput = screen.getByPlaceholderText(
      "Add a custom prompt (max 200 characters)..."
    );
    fireEvent.change(customPromptInput, {
      target: { value: "New custom prompt" },
    });

    const addCustomPromptButton = screen.getByText("Add Custom Prompt");
    fireEvent.click(addCustomPromptButton);

    await waitFor(() => {
      expect(db.customPrompts.add).toHaveBeenCalledWith({
        text: "New custom prompt",
      });
    });
  });
});
