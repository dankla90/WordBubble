const fs = require('fs').promises;
const path = require('path');

// Updated selectUniqueLetters function with letter frequency weights
function selectUniqueLetters() {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    const letterFrequencies = {
        e: 12.7, t: 9.1, a: 8.2, o: 7.5, i: 7.0, n: 6.7, s: 6.3, h: 6.1, r: 6.0,
        d: 4.3, l: 4.0, c: 2.8, u: 2.8, m: 2.4, w: 1.0, f: 2.2, g: 2.0, y: 0.5,
        p: 1.9, b: 1.5, v: 1.0, k: 0.8, x: 0.2, q: 0.1, j: 0.1, z: 0.1
    };

    // Create a weighted alphabet array
    const weightedAlphabet = alphabet.split('').flatMap(letter =>
        Array(Math.round(letterFrequencies[letter] * 10)).fill(letter)
    );

    const startingLetter = weightedAlphabet[Math.floor(Math.random() * weightedAlphabet.length)];
    const selectedLetters = new Set([startingLetter]);

    while (selectedLetters.size < 7) {
        selectedLetters.add(weightedAlphabet[Math.floor(Math.random() * weightedAlphabet.length)]);
    }

    return { startingLetter, selectedLetters: Array.from(selectedLetters) };
}

// Original filterWordsByLetters function
function filterWordsByLetters(words, startingLetter, selectedLetters) {
    const selectedLettersSet = new Set(selectedLetters);

    return words.filter(word => 
        word.includes(startingLetter) &&
        [...word].every(letter => selectedLettersSet.has(letter))
    );
}

// Ensure all selected letters are used in at least one word
function areAllLettersUsed(selectedLetters, validWords) {
    for (const letter of selectedLetters) {
        if (!validWords.some(word => word.includes(letter))) {
            return false;
        }
    }
    return true;
}

// Updated getDailyLetters function
async function getDailyLetters() {
    try {
        console.log("Loading word list...");

        const filePath = path.resolve(__dirname, '../../public/ordliste.txt');
        const text = await fs.readFile(filePath, 'utf-8');
        const words = text.split("\n").map(word => word.trim()).filter(word => word.length > 3);

        let attempts = 0;
        const maxAttempts = 100;

        while (attempts < maxAttempts) {
            const { startingLetter, selectedLetters } = selectUniqueLetters();
            const validWords = filterWordsByLetters(words, startingLetter, selectedLetters);
            attempts++;

            if (areAllLettersUsed(selectedLetters, validWords) && validWords.length >= 4 && validWords.length <= 40) {
                return { letters: selectedLetters, words: validWords };
            }
        }

        throw new Error("Failed to find a suitable word list after max attempts.");
    } catch (error) {
        console.error("Error in getDailyLetters:", error);
        return { letters: [], words: [] };
    }
}

module.exports = { getDailyLetters };

