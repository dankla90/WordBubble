import React, { useState, useEffect, useCallback } from 'react';
import {Button} from './styles/Button.styled';

function ScoreBox({ score, totalWords, playerName, scoreHistory, setPlayerName, isGameFinished }) {
    const [isMinimized, setIsMinimized] = useState(false); // Start minimized by default
    const [nameInput, setNameInput] = useState(playerName);
    const [isNameSaved, setIsNameSaved] = useState(!!playerName);
    
    const handleNameChange = (e) => setNameInput(e.target.value);

    const saveName = () => {
        setPlayerName(nameInput); 
        setIsNameSaved(true);
    };

    // Memoize toggleScoreBox using useCallback
    const toggleScoreBox = useCallback(() => {
        setIsMinimized((prev) => !prev); // Toggle isMinimized state
    }, []); // Empty dependency array to prevent re-creation on each render

    const displayMessage = () => {
        if (score === totalWords) return `Kjempeflott, du klarte alle ${totalWords} ord!`;
        if (score > 0) return `Du klarte ${score} av ${totalWords} mulige ord.`;
        return `Se hvor mange du klarer!`;
    };

    useEffect(() => {
        // Run this only once on component mount
        if (window.innerWidth < 768) {
            setIsMinimized(true); // Set minimized state for mobile by default
        }
    }, []); // Empty dependency array ensures this only runs on mount

    return (
        <>
            <div 
                className={`score-box ${isMinimized ? 'minimized' : 'expanded'}`} 
                onClick={isMinimized ? toggleScoreBox : null} // Only toggle on minimized box
            >
                {isMinimized ? (
                    <div className="minimized-content">
                        <p>Klikk her for å se scores</p>
                    </div>
                ) : (
                    <>
                        <div className="score-box-header">
                            <h2>Score</h2>
                            <Button className="close-btn" onClick={toggleScoreBox}>X</Button>
                        </div>

                        {isNameSaved ? (
                            <h3>{nameInput}</h3>
                        ) : (
                            <div>
                                <input
                                    type="text"
                                    value={nameInput}
                                    onChange={handleNameChange}
                                    placeholder="Skriv inn navnet ditt"
                                />
                                <Button onClick={saveName}>Lagre Navn</Button>
                            </div>
                        )}
                        <h4>{displayMessage()}</h4>

                        <h3>Tidligere spill</h3>
                        <ul>
                            {scoreHistory.map((entry, index) => (
                                <li key={index}>
                                    Dato: {entry.date}, score: {entry.score} av {entry.total} mulige
                                </li>
                            ))}
                        </ul>

                        {isNameSaved && !isGameFinished && (
                            <Button onClick={() => setIsNameSaved(false)}>Bytt navn</Button>
                        )}
                    </>
                )}
            </div>
        </>
    );
}

export default ScoreBox;
