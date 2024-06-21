import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { WordSuggestions } from "./WordSuggestions";
import { getWordSuggestions, getWordDefinition } from "../utils/anthropic";

const dictionaryAPI = async (word) => {
  try {
    const response = await getWordDefinition(word);
    const [definition, example] = response.split("\n\n");
    return { word, definition, example };
  } catch (error) {
    console.error("Error fetching word definition:", error);
    return { word, definition: "Unable to fetch definition", example: "N/A" };
  }
};

const VocabularyTab = ({ wordList, setWordList }) => {
  const [newWord, setNewWord] = useState("");
  const [wordDetails, setWordDetails] = useState(null);
  const [wordSuggestions, setWordSuggestions] = useState([]);

  const addNewWord = async () => {
    if (newWord.trim() !== "") {
      try {
        const details = await dictionaryAPI(newWord.trim());
        setWordList((prevList) => [...prevList, details]);
        setWordDetails(details);
        setNewWord("");
      } catch (error) {
        console.error("Error adding new word:", error);
      }
    }
  };

  const updateWordSuggestions = async () => {
    try {
      const suggestions = await getWordSuggestions(
        wordList.map((word) => word.word)
      );
      setWordSuggestions(suggestions);
    } catch (error) {
      console.error("Error getting word suggestions:", error);
    }
  };

  useEffect(() => {
    if (wordList.length > 0 && wordList.length % 5 === 0) {
      updateWordSuggestions();
    }
  }, [wordList]);

  return (
    <Card>
      <CardHeader>Daily Word Practice</CardHeader>
      <CardContent>
        <div className="flex mb-4">
          <Input
            type="text"
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
            placeholder="Enter a new word"
            className="mr-2"
          />
          <Button onClick={addNewWord}>Add Word</Button>
        </div>
        {wordDetails && (
          <div className="mb-4 p-4 bg-gray-100 rounded">
            <h3 className="font-bold">{wordDetails.word}</h3>
            <p>{wordDetails.definition}</p>
            <p className="italic">{wordDetails.example}</p>
          </div>
        )}
        <ul>
          {wordList.map((word, index) => (
            <li key={index} className="mb-2">
              {word.word}
            </li>
          ))}
        </ul>
        {wordSuggestions.length > 0 && (
          <WordSuggestions
            suggestions={wordSuggestions}
            onAddWord={(word) => setNewWord(word)}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default VocabularyTab;
