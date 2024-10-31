// src/data/dailyWords.js

function selectLetters() {
    const alphabet = "abcdefghijklmnopqrstuvwxyzæøå";
    const startingLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
    const selectedLetters = [startingLetter];

    while (selectedLetters.length < 7) {
        const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
        if (!selectedLetters.includes(randomLetter)) {
            selectedLetters.push(randomLetter);
        }
    }

    console.log("Selected starting letter:", startingLetter);
    console.log("Selected letters:", selectedLetters);
    
    return { startingLetter, selectedLetters };
}

// Function to filter words based on selected letters and starting letter
function filterWordsByLetters(words, startingLetter, selectedLetters) {
    console.log("Filtering words that start with:", startingLetter);

    // Step 1: Filter words that start with the starting letter
    let filteredWords = words.filter(word => word.startsWith(startingLetter));
    console.log("Words starting with", startingLetter, ":", filteredWords.length);

    // Step 2: Create a Set of selected letters for fast lookup
    const letterSet = new Set(selectedLetters);

    // Step 3: Further filter words to include only those composed of selected letters
    filteredWords = filteredWords.filter(word => {
        for (const char of word) {
            if (!letterSet.has(char)) {
                return false; // Word contains a letter not in the selected letters
            }
        }
        return true;
    });

    console.log("Filtered words after letter check:", filteredWords.length);
    return filteredWords;
}

async function getDailyLetters() {
    try {
        console.log("Loading word list...");
        const response = await fetch("ordliste.txt");
        if (!response.ok) {
            throw new Error("Failed to load word list. Status: " + response.status);
        }

        const text = await response.text();
        const words = text.split("\n").map(word => word.trim()).filter(word => word.length > 3);
        console.log("Total words loaded:", words.length);

        let dailyLetters, validWords, attempts = 0;
        const maxAttempts = 50; // Allow up to 50 attempts

        do {
            const { startingLetter, selectedLetters } = selectLetters();
            dailyLetters = selectedLetters;

            // Filter words using the optimized approach
            validWords = filterWordsByLetters(words, startingLetter, selectedLetters);
            attempts++;

            // If more than 30 valid words, continue to select new letters
            if (validWords.length > 30) {
                console.log("More than 30 valid words, selecting new letters...");
                continue; // Skip to select new letters
            }

            // Check if validWords is less than 5 after filtering
            if (validWords.length < 5 && attempts >= maxAttempts) {
                throw new Error("Daniel fucket opp noe, du får sende han en melding, hilsen Daniel");
            }

        } while (validWords.length < 5 && attempts < maxAttempts);

        console.log("Final letters:", dailyLetters);
        console.log("Valid words:", validWords);
        return { letters: dailyLetters, words: validWords };

    } catch (error) {
        console.error("Error in getDailyLetters:", error);
        return { letters: [], words: [] }; // Return empty arrays in case of error
    }
}


export default getDailyLetters;
