import React, { useState, useEffect, useCallback } from 'react';

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
    }, []); // No dependencies, so this function will stay the same across renders

    const displayMessage = () => {
        if (score === totalWords) return `Kjempeflott, du klarte alle ${totalWords} ord!`;
        if (score > 0) return `Du klarte ${score} av ${totalWords} mulige ord.`;
        return `Se hvor mange du klarer!`;
    };

    useEffect(() => {
        // Run this only once on component mount
        if (window.innerWidth < 768 && !isMinimized) {
            toggleScoreBox();
        }
    }, [isMinimized, toggleScoreBox]); // Add dependencies

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
                            <button className="close-btn" onClick={toggleScoreBox}>X</button>
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
                                <button onClick={saveName}>Lagre Navn</button>
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
                            <button onClick={() => setIsNameSaved(false)}>Bytt navn</button>
                        )}
                    </>
                )}
            </div>
        </>
    );
}

export default ScoreBox;