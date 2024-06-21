import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.REACT_APP_ANTHROPIC_API_KEY,
  baseURL: "http://localhost:3000/api",
});

export async function getWordDefinition(word) {
  const completion = await anthropic.completions.create({
    model: "claude-2",
    prompt: `\n\nHuman: Define the word "${word}" and provide an example sentence.\n\nAssistant: Here's the definition and an example sentence for the word "${word}":`,
    max_tokens_to_sample: 300,
  });

  return completion.completion;
}

export async function getWritingFeedback(text) {
  try {
    const completion = await anthropic.completions.create({
      model: "claude-2",
      prompt: `\n\nHuman: Analyze the following piece of writing and provide specific, constructive feedback. Focus on grammar, vocabulary, sentence structure, and overall coherence. Format the response as a JSON object with the following structure:
          {
            "overallFeedback": "A brief overall assessment",
            "grammarIssues": ["List of grammar issues"],
            "vocabularySuggestions": ["List of vocabulary improvement suggestions"],
            "structureComments": ["Comments on sentence and paragraph structure"],
            "coherenceNotes": ["Notes on overall coherence and flow"]
          }
    
          Text to analyze:
          ${text}
    
          \n\nAssistant: Here's the feedback for the given text:`,
      max_tokens_to_sample: 1000,
    });

    const jsonStartIndex = completion.completion.indexOf("{");
    const jsonEndIndex = completion.completion.lastIndexOf("}") + 1;
    const jsonString = completion.completion.slice(
      jsonStartIndex,
      jsonEndIndex
    );

    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error getting writing feedback:", error);
    return {
      overallFeedback:
        "Unable to generate feedback at this time. Please try again later.",
      grammarIssues: [],
      vocabularySuggestions: [],
      structureComments: [],
      coherenceNotes: [],
    };
  }
}

export async function getWordSuggestions(wordList) {
  const completion = await anthropic.completions.create({
    model: "claude-2",
    prompt: `\n\nHuman: Based on the following list of words: ${wordList.join(
      ", "
    )}, suggest 5 new words that would be beneficial for the user to learn next. Provide the words in a comma-separated list.
  
      \n\nAssistant: Here are 5 suggested words based on the given list:`,
    max_tokens_to_sample: 100,
  });

  return completion.completion.split(",").map((word) => word.trim());
}
