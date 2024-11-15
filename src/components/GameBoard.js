import React, { useState, useEffect } from 'react';
import {Button} from './styles/Button.styled';
import '../App.css';

function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000); // Cookie expiration time
    document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
}

function getCookie(name) {
    const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    return match ? match[1] : null;
}

function Letter({ letter, isSelected, onClick, isDisabled, isCenter, isShuffling }) {
    return (
        <div
            className={`letter ${isSelected ? 'selected' : ''} ${isCenter ? 'center' : ''} ${isShuffling ? 'shuffling' : ''}`}
            onClick={() => !isDisabled && onClick(letter)}
            style={{
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                animation: isCenter ? 'none' : undefined,
            }}
        >
            {letter}
        </div>
    );
}


function GameBoard({ onGameEnd, possibleWords = [], letters = [], isGameFinished, guessedWords, addGuessedWord }) {
    const [selectedLetters, setSelectedLetters] = useState([]);
    const [hasGivenUp, setHasGivenUp] = useState(false);
    const [hasPlayedToday, setHasPlayedToday] = useState(false);
    const [displayOrder, setDisplayOrder] = useState([...letters]);
    const [isShuffling, setIsShuffling] = useState(false);

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

    const shuffleLetters = () => {
        setIsShuffling(true);
        setTimeout(() => {
            const centerLetter = displayOrder[0]; // Keep the center letter fixed
            const otherLetters = displayOrder.slice(1); // Exclude the center letter
            
            // Shuffle the other letters
            for (let i = otherLetters.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [otherLetters[i], otherLetters[j]] = [otherLetters[j], otherLetters[i]];
            }
            
            // Combine the center letter with shuffled other letters
            setDisplayOrder([centerLetter, ...otherLetters]);
            setIsShuffling(false);
        }, 500); // Match animation duration
    };
    

    return (
        <div className="game-board">
            <div>Bruk bokstavene til å finne alle ordene, du må bruke bokstaven i midten minst en gang, ordene må være minst fire bokstaver.</div>
            <div className="letter-display">
            {displayOrder.map((letter, index) => (
                <Letter
                    key={index}
                    letter={letter}
                    isSelected={selectedLetters.includes(letter)}
                    onClick={handleLetterClick}
                    isDisabled={isGameFinished || hasPlayedToday}
                    isCenter={index === 0}
                    isShuffling={isShuffling} // Pass the shuffling state
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

            <div>Mulige ord {possibleWords.length} Du har {guessedWords.length}</div>

            <Button onClick={shuffleLetters} disabled={hasGivenUp || isGameFinished || hasPlayedToday || isShuffling}>
                Stokk om bokstavene
            </Button>
            <Button onClick={handleGiveUp} disabled={hasGivenUp || isGameFinished || hasPlayedToday}>Gi opp</Button>
            <Button onClick={handleUnselectAll} disabled={hasGivenUp || isGameFinished || hasPlayedToday}>nullstill valgte bokstaver</Button>
            <Button onClick={handleUndoLetter} disabled={hasGivenUp || isGameFinished || hasPlayedToday || selectedLetters.length === 0}>Angre bokstav</Button>
        </div>
    );
}

export default GameBoard;
