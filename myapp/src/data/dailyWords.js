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

        let dailyLetters, validWords, attempts = 0;
        const maxAttempts = 50;

        while (attempts < maxAttempts) {
            const { startingLetter, selectedLetters } = selectLetters();
            dailyLetters = selectedLetters;
            validWords = filterWordsByLetters(words, startingLetter, selectedLetters);
            attempts++;

            // Ensure validWords is defined and is an array
            if (Array.isArray(validWords) && validWords.length >= 5 && validWords.length <= 30) {
                return { letters: dailyLetters, words: validWords };
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

function selectLetters() {
    const alphabet = "abcdefghijklmnopqrstuvwxyz".split('');
    const startingLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
    
    // Randomly select 6 letters from the alphabet
    const selectedLetters = [startingLetter, ...new Set(Array.from({length: 5}, () => 
        alphabet[Math.floor(Math.random() * alphabet.length)]))];

    return { startingLetter, selectedLetters };
}

function filterWordsByLetters(words, startingLetter, selectedLetters) {
    const selectedLettersSet = new Set(selectedLetters);
    return words.filter(word => {
        // Check if the word starts with the required starting letter
        if (word[0] !== startingLetter) return false;

        // Check if each letter in the word is within the selected letters
        for (let letter of word) {
            if (!selectedLettersSet.has(letter)) return false;
        }
        return true;
    });
}

module.exports = getDailyLetters;
