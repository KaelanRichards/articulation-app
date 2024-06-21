import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { getWritingFeedback } from "../utils/anthropic";
import db from "../utils/db";

const WritingTab = ({ journalEntries, setJournalEntries }) => {
  console.log("Journal entries in WritingTab:", journalEntries);
  const [currentJournalEntry, setCurrentJournalEntry] = useState("");
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [selectedEntryId, setSelectedEntryId] = useState(null);
  const [processingFeedback, setProcessingFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [customPrompts, setCustomPrompts] = useState([]);
  const [newCustomPrompt, setNewCustomPrompt] = useState("");

  const writingPrompts = [
    "Describe a moment when effective communication made a significant difference in your life.",
    "Write about a time when you struggled to express yourself clearly. What did you learn?",
    "Imagine a world where everyone speaks the same language. What are the pros and cons?",
    "Reflect on how your communication style has evolved over the years.",
    "Write a letter to your future self about your communication goals.",
  ];

  useEffect(() => {
    setCurrentPrompt(
      writingPrompts[Math.floor(Math.random() * writingPrompts.length)]
    );
    loadJournalEntriesFromDB();
    loadCustomPromptsFromDB(); // Load custom prompts on component mount
  }, []);

  const loadJournalEntriesFromDB = async () => {
    const entries = await db.journalEntries.toArray();
    console.log("Loaded entries:", entries);
    setJournalEntries(entries);
  };

  const loadCustomPromptsFromDB = async () => {
    const prompts = await db.customPrompts.toArray();
    setCustomPrompts(prompts);
  };

  const addCustomPrompt = async () => {
    if (newCustomPrompt.trim() !== "") {
      const id = await db.customPrompts.add({ text: newCustomPrompt });
      setCustomPrompts([...customPrompts, { id, text: newCustomPrompt }]);
      setNewCustomPrompt("");
    }
  };

  const saveJournalEntry = async () => {
    if (currentJournalEntry.trim() !== "") {
      setIsLoading(true);
      try {
        const newEntry = {
          content: currentJournalEntry,
          prompt: currentPrompt,
          date: new Date().toISOString(),
          wordCount: currentJournalEntry.split(/\s+/).length,
        };
        const id = await db.journalEntries.add(newEntry);
        setJournalEntries((prevEntries) => [
          { ...newEntry, id },
          ...prevEntries,
        ]);
        setCurrentJournalEntry("");
        setCurrentPrompt(
          [...writingPrompts, ...customPrompts.map((p) => p.text)][
            Math.floor(
              Math.random() * (writingPrompts.length + customPrompts.length)
            )
          ]
        );
      } catch (error) {
        console.error("Error saving journal entry:", error);
      } finally {
        setIsLoading(false);
      }
    }
  }; // Add this closing brace

  const processFeedback = async (entryId) => {
    setProcessingFeedback(entryId);
    try {
      const entry = journalEntries.find((e) => e.id === entryId);
      const feedback = await getWritingFeedback(entry.content);
      await db.journalEntries.update(entryId, { feedback });
      setJournalEntries(
        journalEntries.map((e) => (e.id === entryId ? { ...e, feedback } : e))
      );
    } catch (error) {
      console.error("Error processing feedback:", error);
    } finally {
      setProcessingFeedback(null);
    }
  };

  const deleteJournalEntry = async (id) => {
    await db.journalEntries.delete(id);
    setJournalEntries(journalEntries.filter((entry) => entry.id !== id));
    setSelectedEntryId(null);
  };

  const confirmDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      deleteJournalEntry(id);
    }
  };

  const handleEntrySelect = (value) => {
    const entryId = parseInt(value, 10);
    setSelectedEntryId(entryId);
  };

  const selectedEntry = selectedEntryId
    ? journalEntries.find((entry) => entry.id === selectedEntryId)
    : null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>Daily Writing Practice</CardHeader>
        <CardContent>
          <h3 className="font-bold mb-2">Today's Prompt:</h3>
          <p className="mb-4">{currentPrompt}</p>
          <textarea
            value={currentJournalEntry}
            onChange={(e) => setCurrentJournalEntry(e.target.value)}
            placeholder="Write your response here..."
            className="w-full h-40 p-2 border rounded mb-2"
          />
          <p className="text-sm text-gray-500 mb-2">
            Word count:{" "}
            {currentJournalEntry.split(/\s+/).filter(Boolean).length}
          </p>
          <Button onClick={saveJournalEntry}>Save Entry</Button>
          {isLoading && (
            <div className="mt-2 flex items-center text-blue-500">
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Processing your entry...
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>Review Past Entries</CardHeader>
        <CardContent>
          <p>Number of entries: {journalEntries.length}</p>
          <Select
            onValueChange={handleEntrySelect}
            value={selectedEntryId ? selectedEntryId.toString() : undefined}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an entry to review" />
            </SelectTrigger>
            <SelectContent>
              {journalEntries.map((entry) => {
                const date = new Date(entry.date);
                const formattedDate = `${(date.getMonth() + 1)
                  .toString()
                  .padStart(2, "0")}/${date
                  .getDate()
                  .toString()
                  .padStart(2, "0")}/${date.getFullYear()}`;
                console.log("Formatted date:", formattedDate);
                return (
                  <SelectItem key={entry.id} value={entry.id.toString()}>
                    {formattedDate} - {entry.wordCount} words
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          {selectedEntry && (
            <div className="mt-4 p-4 bg-gray-100 rounded">
              <p className="font-bold">Prompt: {selectedEntry.prompt}</p>
              <p className="mt-2">{selectedEntry.content}</p>
              <p className="mt-2 text-sm text-gray-500">
                Written on: {new Date(selectedEntry.date).toLocaleString()}
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Word count: {selectedEntry.wordCount}
              </p>
              <div className="mt-4">
                <h4 className="font-bold">Feedback:</h4>
                {selectedEntry.feedback ? (
                  typeof selectedEntry.feedback === "object" ? (
                    <>
                      <p>{selectedEntry.feedback.overallFeedback}</p>
                      {/* Render other feedback sections */}
                    </>
                  ) : (
                    <p>{selectedEntry.feedback}</p>
                  )
                ) : (
                  <Button
                    onClick={() => processFeedback(selectedEntry.id)}
                    disabled={processingFeedback === selectedEntry.id}
                  >
                    {processingFeedback === selectedEntry.id
                      ? "Processing..."
                      : "Get Feedback"}
                  </Button>
                )}
              </div>
              <Button
                onClick={() => confirmDelete(selectedEntry.id)}
                className="mt-2"
              >
                Delete Entry
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>Custom Prompts</CardHeader>
        <CardContent>
          <input
            type="text"
            value={newCustomPrompt}
            onChange={(e) => setNewCustomPrompt(e.target.value.slice(0, 200))}
            placeholder="Add a custom prompt (max 200 characters)..."
            className="w-full p-2 border rounded"
            maxLength={200}
          />
          <p className="text-sm text-gray-500 mt-1">
            {200 - newCustomPrompt.length} characters remaining
          </p>
          <Button onClick={addCustomPrompt} className="mt-2">
            Add Custom Prompt
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default WritingTab;
