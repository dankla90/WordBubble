import React, { useState, useEffect } from 'react';
import getDailyLetters from '../data/dailyWords';
import '../App.css'; // Make sure this CSS file has styles for your components

function Letter({ letter, isSelected, onClick }) {
    return (
        <div
            className={`letter ${isSelected ? 'selected' : ''}`}
            onClick={() => onClick(letter)}
        >
            {letter}
        </div>
    );
}

function GameBoard({ onGameEnd }) {
    const [letters, setLetters] = useState([]);
    const [possibleWords, setPossibleWords] = useState([]);
    const [guessedWords, setGuessedWords] = useState([]);
    const [hasGivenUp, setHasGivenUp] = useState(false);
    const [selectedLetters, setSelectedLetters] = useState([letters[0] || '']);
    
    useEffect(() => {
        async function fetchGameData() {
            const { letters, words } = await getDailyLetters();
            setLetters(letters);
            setPossibleWords(words);
            setSelectedLetters([letters[0]]); // Start with the first letter selected
        }
        fetchGameData();
    }, []);

    const addToGuessedWords = (guess) => {
        setGuessedWords([...guessedWords, guess]);
        setPossibleWords(possibleWords.filter(word => word !== guess)); // Remove from possible words
        setSelectedLetters([letters[0]]); // Reset selection to only the first letter
    };

    const handleGiveUp = () => {
        setHasGivenUp(true);
        onGameEnd(guessedWords.length); // Update score box when "Give Up" is pressed
    };

    const handleLetterClick = (letter) => {
        if (hasGivenUp) return; // Prevent further input if the game has ended
        
        const newSelected = [...selectedLetters, letter];
        setSelectedLetters(newSelected);
        
        const newGuess = newSelected.join('');
        if (possibleWords.includes(newGuess) && !guessedWords.includes(newGuess) && newGuess.length > 0) {
            addToGuessedWords(newGuess);
            if (guessedWords.length + 1 === possibleWords.length) handleGiveUp(); // End game if all words are guessed
        }
    };

    const handleUnselectAll = () => {
        setSelectedLetters([letters[0]]);
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

            <button onClick={handleGiveUp} disabled={hasGivenUp}>Give Up</button>
            <button onClick={handleUnselectAll} disabled={hasGivenUp}>Unselect All</button>

            <div>
                <h3>Guessed Words</h3>
                {guessedWords.map((word, index) => (
                    <div key={index}>{word}</div>
                ))}
            </div>

            <div>
                <h3>Word List</h3>
                {hasGivenUp ? (
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
