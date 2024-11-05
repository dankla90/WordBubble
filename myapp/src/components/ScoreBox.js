import React, { useState } from 'react';
import { setCookie } from '../utils/cookies';

function ScoreBox({ score, totalWords, playerName, setPlayerName, scoreHistory }) {
    const [nameInput, setNameInput] = useState(playerName);
    const [isNameSaved, setIsNameSaved] = useState(!!playerName);

    const handleNameChange = (e) => {
        setNameInput(e.target.value);
    };

    const saveName = () => {
        setPlayerName(nameInput);
        setCookie("playerName", nameInput, 1);
        setIsNameSaved(true);
    };

    const displayMessage = () => {
        if (score === totalWords) {
            return `Kjempeflott, du klarte alle ${totalWords} ord!`;
        } else {
            return `Du klarte ${score} av ${totalWords} mulige ord.`;
        }
    };

    return (
        <div className="score-box">
            <h2>Score</h2>
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

            <h3>Score History</h3>
            <ul>
                {scoreHistory.map((entry, index) => {
                    console.log("Score History Data:", scoreHistory);

                    // Check if entry is valid and contains required properties
                    if (entry && entry.date && entry.score !== undefined && entry.total !== undefined) {
                        return (
                            <li key={index}>{`${entry.date}: ${entry.score} / ${entry.total}`}</li>
                        );
                    } else {
                        return <li key={index}>Invalid entry</li>; // Or you can skip rendering
                    }
                })}
            </ul>
        </div>
    );
}

export default ScoreBox;
