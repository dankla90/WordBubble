const fs = require('fs');
const path = require('path');
const getDailyLetters = require('../src/data/dailyWords');

// Save daily puzzle as JSON in the `public` directory
async function generatePuzzle() {
    const { letters, words } = await getDailyLetters();
    const puzzleData = { letters, words };

    fs.writeFileSync(
        path.join(__dirname, '../public/dailyLetters.json'),
        JSON.stringify(puzzleData)
    );
    console.log("Puzzle generated successfully!");
}

generatePuzzle().catch(console.error);
