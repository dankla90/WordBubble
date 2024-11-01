import React, { useState } from 'react';

function ScoreBox({ score, totalWords, playerName, setPlayerName }) {
    const [nameInput, setNameInput] = useState(playerName);
    const [isNameSaved, setIsNameSaved] = useState(!!playerName);

    const handleNameChange = (e) => {
        setNameInput(e.target.value);
    };

    const saveName = () => {
        setPlayerName(nameInput);
        setCookie("playerName", nameInput, 1); // Save name in a cookie
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
        </div>
    );
}

function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 86400000).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}

export default ScoreBox;
