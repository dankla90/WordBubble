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
        const maxAttempts = 100;

        while (attempts < maxAttempts) {
            const { startingLetter, selectedLetters } = selectUniqueLetters();
            const validWords = filterWordsByLetters(words, startingLetter, selectedLetters);
            attempts++;

            // Ensure every selected letter is used in at least one valid word
            if (areAllLettersUsed(selectedLetters, validWords)) {
                if (validWords.length >= 4 && validWords.length <= 30) {
                    return { letters: selectedLetters, words: validWords };
                }
            }

            if (validWords.length > 40) {
                console.log("More than 40 valid words, selecting new letters...");
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
        // Ensure the word contains the starting letter
        word.includes(startingLetter) && 
        // Ensure every letter in the word is from the selected set of letters
        [...word].every(letter => selectedLettersSet.has(letter))
    );
}

function areAllLettersUsed(selectedLetters, validWords) {
    // Check if all selected letters are used in at least one valid word
    for (const letter of selectedLetters) {
        const isUsed = validWords.some(word => word.includes(letter));
        if (!isUsed) {
            console.log(`Letter '${letter}' is not used in any valid words.`);
            return false; // If any letter is not used, return false
        }
    }
    return true;
}

module.exports = getDailyLetters;
