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

const WritingTab = ({ journalEntries, setJournalEntries }) => {
  const [currentJournalEntry, setCurrentJournalEntry] = useState("");
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [interactiveFeedback, setInteractiveFeedback] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
  }, []);

  const handleInteractiveFeedback = async () => {
    if (currentJournalEntry.trim().length > 50) {
      setIsLoading(true);
      try {
        const feedback = await getWritingFeedback(currentJournalEntry);
        setInteractiveFeedback(feedback);
      } catch (error) {
        console.error("Error getting interactive feedback:", error);
        setInteractiveFeedback({
          overallFeedback:
            "Unable to get feedback at this time. Please try again later.",
          grammarIssues: [],
          vocabularySuggestions: [],
          structureComments: [],
          coherenceNotes: [],
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const saveJournalEntry = async () => {
    if (currentJournalEntry.trim() !== "") {
      setIsLoading(true);
      try {
        const feedback = await getWritingFeedback(currentJournalEntry);
        const newEntry = {
          id: Date.now(),
          content: currentJournalEntry,
          prompt: currentPrompt,
          date: new Date().toLocaleDateString(),
          feedback: feedback,
        };
        setJournalEntries((prevEntries) => [newEntry, ...prevEntries]);
        setCurrentJournalEntry("");
        setCurrentPrompt(
          writingPrompts[Math.floor(Math.random() * writingPrompts.length)]
        );
      } catch (error) {
        console.error("Error saving journal entry:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Card>
      <CardHeader>Daily Writing Practice</CardHeader>
      <CardContent>
        <h3 className="font-bold mb-2">Today's Prompt:</h3>
        <p className="mb-4">{currentPrompt}</p>
        <textarea
          value={currentJournalEntry}
          onChange={(e) => setCurrentJournalEntry(e.target.value)}
          onBlur={handleInteractiveFeedback}
          placeholder="Write your response here..."
          className="w-full h-40 p-2 border rounded mb-2"
        />
        <Button onClick={saveJournalEntry}>Save Entry</Button>
        {isLoading && (
          <div className="mt-2 text-blue-500">
            Loading... Please wait while we process your entry.
          </div>
        )}
        {interactiveFeedback && (
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <h4 className="font-bold">Interactive Feedback:</h4>
            <p className="mt-2">{interactiveFeedback.overallFeedback}</p>
            <p className="mt-2">
              Grammar Issues: {interactiveFeedback.grammarIssues.join(", ")}
            </p>
            <p className="mt-2">
              Vocabulary Suggestions:{" "}
              {interactiveFeedback.vocabularySuggestions.join(", ")}
            </p>
            <p className="mt-2">
              Structure Comments:{" "}
              {interactiveFeedback.structureComments.join(", ")}
            </p>
            <p className="mt-2">
              Coherence Notes: {interactiveFeedback.coherenceNotes.join(", ")}
            </p>
          </div>
        )}
        <div className="mt-4">
          <h3 className="font-bold mb-2">Review Past Entries:</h3>
          <Select
            onValueChange={(value) =>
              setSelectedEntry(
                journalEntries.find((entry) => entry.id.toString() === value)
              )
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an entry to review" />
            </SelectTrigger>
            <SelectContent>
              {journalEntries.map((entry) => (
                <SelectItem key={entry.id} value={entry.id.toString()}>
                  {entry.date}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedEntry && (
            <div className="mt-4 p-4 bg-gray-100 rounded">
              <p className="font-bold">Prompt: {selectedEntry.prompt}</p>
              <p className="mt-2">{selectedEntry.content}</p>
              <p className="mt-2 text-sm text-gray-500">
                Written on: {selectedEntry.date}
              </p>
              <div className="mt-4">
                <h4 className="font-bold">Feedback:</h4>
                {typeof selectedEntry.feedback === "object" ? (
                  <>
                    <p>{selectedEntry.feedback.overallFeedback}</p>
                    {/* Render other feedback sections */}
                  </>
                ) : (
                  <p>{selectedEntry.feedback}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WritingTab;
