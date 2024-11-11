// WordDisplay.js
import React from 'react';

function WordDisplay({ guessedWords, possibleWords, hasGivenUp, hasPlayedToday }) {
    return (
        <div className="word-display">
            <h2>Riktige ord</h2>
            <ul>
                {guessedWords.map((word, index) => (
                    <li key={index}>{word}</li>
                ))}
            </ul>

            {/* Optionally, display possible words when the player has given up */}
            {hasGivenUp && (
                <>
                    <h2>Mulige ord:</h2>
                    <ul>
                        {possibleWords.map((word, index) => (
                            <li key={index}>{word}</li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
}

export default WordDisplay;
