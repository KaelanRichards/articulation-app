import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { BookOpen, Mic, PenTool } from "lucide-react";
import VocabularyTab from "./components/VocabularyTab";
import SpeakingTab from "./components/SpeakingTab";
import WritingTab from "./components/WritingTab";

const App = () => {
  const [wordList, setWordList] = useState([]);
  const [journalEntries, setJournalEntries] = useState([]);

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Articulation Improvement App</h1>

      <Tabs defaultValue="vocabulary">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="vocabulary">
            <BookOpen className="mr-2" />
            Vocabulary
          </TabsTrigger>
          <TabsTrigger value="speaking">
            <Mic className="mr-2" />
            Speaking
          </TabsTrigger>
          <TabsTrigger value="writing">
            <PenTool className="mr-2" />
            Writing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="vocabulary">
          <VocabularyTab wordList={wordList} setWordList={setWordList} />
        </TabsContent>

        <TabsContent value="speaking">
          <SpeakingTab />
        </TabsContent>

        <TabsContent value="writing">
          <WritingTab
            journalEntries={journalEntries}
            setJournalEntries={setJournalEntries}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default App;
