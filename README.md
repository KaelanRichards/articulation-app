# Articulation Improvement App

This project is a React-based web application designed to help users improve their articulation skills through vocabulary building, speaking practice, and writing exercises.

## Features

1. **Vocabulary Tab**:

   - Add new words to your personal word list
   - Get definitions and example sentences for each word
   - Receive word suggestions based on your current list

2. **Speaking Tab**:

   - Daily speaking topics for practice
   - Record your speech and track recording time
   - Refresh topics for new challenges

3. **Writing Tab**:
   - Daily writing prompts
   - Save journal entries
   - Receive AI-powered feedback on your writing

## Getting Started

### Prerequisites

- Node.js (version 12 or higher)
- npm (comes with Node.js)

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/articulation-improvement-app.git
   ```

2. Navigate to the project directory:

   ```
   cd articulation-improvement-app
   ```

3. Install dependencies:

   ```
   npm install
   ```

4. Create a `.env` file in the root directory and add your Anthropic API key:

   ```
   REACT_APP_ANTHROPIC_API_KEY=your_api_key_here
   ```

5. Start the development server:

   ```
   npm start
   ```

6. Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

## Technologies Used

- React
- Tailwind CSS
- Radix UI
- Anthropic AI API

## Project Structure

```
src/
├── components/
│   ├── ui/
│   ├── VocabularyTab.js
│   ├── SpeakingTab.js
│   ├── WritingTab.js
│   └── WordSuggestions.js
├── utils/
│   └── anthropic.js
├── App.js
├── index.js
└── index.css
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
