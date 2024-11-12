// WordDisplay.js
import React from 'react';

function WordDisplay({ guessedWords, possibleWords, hasGivenUp }) {
    // Filter out guessed words from possible words
    const unguessedWords = possibleWords.filter(word => !guessedWords.includes(word));

    return (
        <div className="word-display">
            <h2>Riktige ord {guessedWords.length}</h2>
            <ul>
                {guessedWords.map((word, index) => (
                    <li key={index}>{word}</li>
                ))}
            </ul>

            {/* Display only unguessed possible words when the player has given up */}
            {hasGivenUp && (
                <>
                    <h2>Ugjettete ord {unguessedWords.length}:</h2>
                    <ul>
                        {unguessedWords.map((word, index) => (
                            <li key={index}>{word}</li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
}

export default WordDisplay;
