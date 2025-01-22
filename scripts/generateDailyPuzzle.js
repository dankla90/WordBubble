const fs = require('fs').promises;
const path = require('path');
const { getDailyLetters } = require('../src/data/dailyWords');  // Make sure it's destructured correctly

async function generatePuzzle() {
    try {
        // Generate daily letters and words, using await for the async function
        const { letters, words } = await getDailyLetters();  // Await the function call here

        // Prepare puzzle data
        const puzzleData = { letters, words };

        // Define the file path
        const filePath = path.join(__dirname, '../public/dailyLetters.json');

        // Write the puzzle data as JSON to the specified file
        await fs.writeFile(filePath, JSON.stringify(puzzleData, null, 2)); // Add indentation for readability
        console.log("Puzzle generated successfully:", puzzleData);
    } catch (error) {
        console.error("Error generating the daily puzzle:", error);
    }
}

// Run the puzzle generation script
generatePuzzle();
