import React, { useState, useEffect } from 'react';
import '../App.css';

function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); // Cookie expiration time
    document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
}

function getCookie(name) {
    const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    return match ? match[1] : null;
}

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

function GameBoard({ onGameEnd, possibleWords = [], letters = [], isGameFinished, guessedWords, addGuessedWord }) {
    const [selectedLetters, setSelectedLetters] = useState([]);
    const [hasGivenUp, setHasGivenUp] = useState(false);
    const [hasPlayedToday, setHasPlayedToday] = useState(false);

    // Check if the game has been played today using cookies
    useEffect(() => {
        const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
        const lastPlayedDate = getCookie('lastPlayedDate'); // Get date from cookie

        if (lastPlayedDate && lastPlayedDate === today) {
            setHasPlayedToday(true); // Game has been played today
        } else {
            setHasPlayedToday(false); // Game hasn't been played today
        }
    }, []);

    const addToGuessedWords = (guess) => {
        addGuessedWord(guess); // Use prop function to update guessed words in parent
        setSelectedLetters([]); // Reset selection
    };

    const handleGiveUp = () => {
        setHasGivenUp(true);
        setCookie('lastPlayedDate', new Date().toISOString().split('T')[0], 1); // Set today's date in cookie
        onGameEnd(guessedWords.length); // Update score when "Give Up" is pressed
    };

    const handleLetterClick = (letter) => {
        if (hasGivenUp || isGameFinished || hasPlayedToday) return; // Prevent actions if disabled or game played today

        // Add the clicked letter to the selected letters
        const newSelected = [...selectedLetters, letter];
        setSelectedLetters(newSelected);

        const newGuess = newSelected.join('');
        
        // Ensure the guess contains the center letter and matches the rules
        if (newGuess.includes(letters[0]) && possibleWords.includes(newGuess) && !guessedWords.includes(newGuess)) {
            addToGuessedWords(newGuess);
            if (guessedWords.length + 1 === possibleWords.length) handleGiveUp();
        }
    };

    const handleUnselectAll = () => {
        setSelectedLetters([]); // Unselect all letters
    };

    // Undo the last selected letter
    const handleUndoLetter = () => {
        setSelectedLetters((prevSelectedLetters) => {
            // Remove the last selected letter
            const updatedLetters = [...prevSelectedLetters];
            updatedLetters.pop();
            return updatedLetters;
        });
    };

    return (
        <div className="game-board">
            <div>Bruk bokstavene til å finne alle ordene</div>
            <div className="letter-display">
                {letters.map((letter, index) => (
                    <Letter
                        key={index}
                        letter={letter}
                        isSelected={selectedLetters.includes(letter)}
                        onClick={handleLetterClick}
                        isDisabled={isGameFinished || hasPlayedToday} // Disable interaction if game is finished or has played today
                    />
                ))}
            </div>

            <div className="selected-letters">
                <h3>Valgte bokstaver</h3>
                <div className="selected-letters-display">
                    {selectedLetters.map((letter, index) => (
                        <span key={index} className="selected-letter">
                            {letter}
                        </span>
                    ))}
                </div>
            </div>

            <div>Mulige ord {possibleWords.length}</div>

            <button onClick={handleGiveUp} disabled={hasGivenUp || isGameFinished || hasPlayedToday}>Gi opp</button>
            <button onClick={handleUnselectAll} disabled={hasGivenUp || isGameFinished || hasPlayedToday}>nullstill valgte bokstaver</button>
            <button onClick={handleUndoLetter} disabled={hasGivenUp || isGameFinished || hasPlayedToday || selectedLetters.length === 0}>Angre bokstav</button>
        </div>
    );
}

export default GameBoard;
