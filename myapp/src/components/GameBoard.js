import React, { useState, useEffect } from 'react';
import '../App.css';

function Letter({ letter, isSelected, onClick, isDisabled }) {
    return (
        <div
            className={`letter ${isSelected ? 'selected' : ''}`}
            onClick={() => !isDisabled && onClick(letter)} // Disable click if isDisabled
            style={{ cursor: isDisabled ? 'not-allowed' : 'pointer' }} // Change cursor
        >
            {letter}
        </div>
    );
}

function GameBoard({ onGameEnd, possibleWords = [], letters = [], isDisabled }) {
    const [guessedWords, setGuessedWords] = useState([]);
    const [hasGivenUp, setHasGivenUp] = useState(false);
    const [selectedLetters, setSelectedLetters] = useState([]);

    // Ensure letters is not empty before accessing its elements
    useEffect(() => {
        if (letters.length > 0) {
            setSelectedLetters([letters[0]]); // Start with the first letter selected
        }
    }, [letters]);

    const addToGuessedWords = (guess) => {
        setGuessedWords([...guessedWords, guess]);
        if (letters.length > 0) setSelectedLetters([letters[0]]); // Reset selection
    };

    const handleGiveUp = () => {
        setHasGivenUp(true);
        onGameEnd(guessedWords.length); // Update score box when "Give Up" is pressed
    };

    const handleLetterClick = (letter) => {
        if (hasGivenUp || isDisabled) return; // Prevent actions if disabled

        const newSelected = [...selectedLetters, letter];
        setSelectedLetters(newSelected);

        const newGuess = newSelected.join('');
        if (possibleWords.includes(newGuess) && !guessedWords.includes(newGuess)) {
            addToGuessedWords(newGuess);
            if (guessedWords.length + 1 === possibleWords.length) handleGiveUp();
        }
    };

    const handleUnselectAll = () => {
        if (letters.length > 0) setSelectedLetters([letters[0]]);
    };

    return (
        <div className="game-board">
            <h2>Daily Word Puzzle</h2>
            <div>Use the letters:</div>
            <div className="letter-display">
                {letters.map((letter, index) => (
                    <Letter
                        key={index}
                        letter={letter}
                        isSelected={selectedLetters.includes(letter)}
                        onClick={handleLetterClick}
                        isDisabled={isDisabled} // Pass disabled prop
                    />
                ))}
            </div>

            <div className="selected-letters">
                <h3>Selected Letters:</h3>
                <div className="selected-letters-display">
                    {selectedLetters.map((letter, index) => (
                        <span key={index} className="selected-letter">
                            {letter}
                        </span>
                    ))}
                </div>
            </div>

            <div>Total possible words: {possibleWords.length}</div>

            <button onClick={handleGiveUp} disabled={hasGivenUp || isDisabled}>Give Up</button>
            <button onClick={handleUnselectAll} disabled={hasGivenUp || isDisabled}>Unselect All</button>

            <div>
                <h3>Guessed Words</h3>
                {guessedWords.map((word, index) => (
                    <div key={index}>{word}</div>
                ))}
            </div>

            <div>
                <h3>Word List</h3>
                {/* Display possible words regardless of game status */}
                {hasGivenUp || isDisabled ? (
                    <div>
                        <h4>All possible words:</h4>
                        {possibleWords.map((word, index) => (
                            <div key={index}>{word}</div>
                        ))}
                    </div>
                ) : (
                    <p>Keep guessing!</p>
                )}
            </div>
        </div>
    );
}

export default GameBoard;
