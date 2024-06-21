import Dexie from "dexie";

const db = new Dexie("ArticulationApp");

db.version(1).stores({
  words: "++id, word, definition, example",
  journalEntries: "++id, content, prompt, date, feedback",
  customPrompts: "++id, text",
});

export default db;
