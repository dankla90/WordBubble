// scripts/generateDailyPuzzle.js
const fs = require('fs');
const getDailyLetters = require('../src/data/dailyWords');

async function generatePuzzle() {
    const { letters, words } = await getDailyLetters();
    const puzzleData = { letters, words, date: new Date().toISOString() };
    fs.writeFileSync('public/dailyPuzzle.json', JSON.stringify(puzzleData, null, 2));
    console.log("Daily puzzle generated and saved!");
}

generatePuzzle();
