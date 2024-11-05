const fs = require('fs').promises;
const path = require('path');

async function getDailyLetters() {
    try {
        console.log("Loading word list...");

        const filePath = path.resolve(__dirname, '../../public/ordliste.txt'); // Adjust path if necessary
        console.log("Attempting to read file at:", filePath);
        const text = await fs.readFile(filePath, 'utf-8');

        const words = text.split("\n").map(word => word.trim()).filter(word => word.length > 3);
        console.log("Total words loaded:", words.length);

        let attempts = 0;
        const maxAttempts = 50;

        while (attempts < maxAttempts) {
            const { startingLetter, selectedLetters } = selectUniqueLetters();
            const validWords = filterWordsByLetters(words, startingLetter, selectedLetters);
            attempts++;

            if (validWords.length >= 5 && validWords.length <= 30) {
                return { letters: selectedLetters, words: validWords };
            }

            if (validWords.length > 30) {
                console.log("More than 30 valid words, selecting new letters...");
            }
        }

        throw new Error("Failed to find a suitable word list after max attempts.");

    } catch (error) {
        console.error("Error in getDailyLetters:", error);
        return { letters: [], words: [] };
    }
}

function selectUniqueLetters() {
    const alphabet = "abcdefghijklmnopqrstuvwxyz".split('');
    const startingLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
    
    const selectedLetters = new Set([startingLetter]);
    while (selectedLetters.size < 7) {
        selectedLetters.add(alphabet[Math.floor(Math.random() * alphabet.length)]);
    }

    return { startingLetter, selectedLetters: Array.from(selectedLetters) };
}

function filterWordsByLetters(words, startingLetter, selectedLetters) {
    const selectedLettersSet = new Set(selectedLetters);
    return words.filter(word => 
        word[0] === startingLetter &&
        [...word].every(letter => selectedLettersSet.has(letter))
    );
}

module.exports = getDailyLetters;
