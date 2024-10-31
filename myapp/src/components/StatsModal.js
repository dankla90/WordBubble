import React from 'react';

function StatsModal({ possibleWords, enteredWords, onClose }) {
    // Filter out words the player missed
    const missedWords = possibleWords.filter(word => !enteredWords.includes(word));

    return (
        <div className="stats-modal">
            <h2>Game Over</h2>
            <p>Correct Words:</p>
            <ul>
                {enteredWords.map((word, index) => <li key={index}>{word}</li>)}
            </ul>
            <p>Missed Words:</p>
            <ul>
                {missedWords.map((word, index) => <li key={index}>{word}</li>)}
            </ul>
            <button onClick={onClose}>Close</button>
        </div>
    );
}

export default StatsModal;
