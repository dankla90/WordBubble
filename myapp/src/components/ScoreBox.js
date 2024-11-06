import React, { useState } from 'react';

function ScoreBox({ score, totalWords, playerName, scoreHistory, setPlayerName, isGameFinished }) {
    const [nameInput, setNameInput] = useState(playerName);
    const [isNameSaved, setIsNameSaved] = useState(!!playerName);

    const handleNameChange = (e) => {
        setNameInput(e.target.value);
    };

    const saveName = () => {
        setPlayerName(nameInput); // Update player name and save it in cookies
        setIsNameSaved(true);
    };

    const handleChangeName = () => {
        setIsNameSaved(false); // Allow the user to change the name
    };

    const displayMessage = () => {
        if (score === totalWords) {
            return `Kjempeflott, du klarte alle ${totalWords} ord!`;
        } else if (score > 0) {
            return `Du klarte ${score} av ${totalWords} mulige ord.`;
        } else {
            return `Se hvor mange du klarer!`;
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
                {scoreHistory.map((entry, index) => (
                    <li key={index}>
                        {entry.playerName}: {entry.date}, score: {entry.score}, total: {entry.total}
                    </li>
                ))}
            </ul>

            {/* Show 'Change Name' button if the name is saved */}
            {isNameSaved && !isGameFinished && (
                <button onClick={handleChangeName}>Change Name</button>
            )}
        </div>
    );
}

export default ScoreBox;
