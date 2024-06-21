import React from "react";
import { Card, CardHeader, CardContent } from "./ui/card";

export function WordSuggestions({ suggestions, onAddWord }) {
  return (
    <Card>
      <CardHeader>Suggested Words</CardHeader>
      <CardContent>
        <ul className="list-disc pl-5">
          {suggestions.map((word, index) => (
            <li key={index} className="mb-2">
              {word}{" "}
              <button
                onClick={() => onAddWord(word)}
                className="text-blue-500 hover:text-blue-700"
              >
                Add
              </button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
