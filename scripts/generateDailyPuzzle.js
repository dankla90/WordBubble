const fs = require('fs').promises;
const path = require('path');
const { getDailyLetters } = require('../src/data/dailyWords'); 

async function generatePuzzle() {
    try {

        const { letters, words } = await getDailyLetters();  


        const puzzleData = { letters, words };

        const filePath = path.join(__dirname, '../public/dailyLetters.json');

        await fs.writeFile(filePath, JSON.stringify(puzzleData, null, 2));
        console.log("Puzzle generated successfully:", puzzleData);
    } catch (error) {
        console.error("Error generating the daily puzzle:", error);
    }
}

generatePuzzle();
