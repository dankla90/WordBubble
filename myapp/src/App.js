import React, { useState, useEffect } from 'react';
import GameBoard from './components/GameBoard';
import ScoreBox from './components/ScoreBox';
import getDailyLetters from './data/dailyWords';
import './index.css';

function App() {
    const [score, setScore] = useState(0);
    const [totalWords, setTotalWords] = useState(0); // New state for total words
    const [playerName, setPlayerName] = useState(getCookie("playerName") || "");

    const handleGameEnd = (finalScore) => {
        setScore(finalScore);
        setTotalWords(finalScore); // Assuming finalScore will be the total words
        setCookie("lastScore", finalScore, 1);
    };

    useEffect(() => {
        async function fetchGameData() {
            const { words } = await getDailyLetters();
            setTotalWords(words.length); // Set the total words when the game data is fetched
        }
        fetchGameData();
    }, []);

    return (
        <div className="App">
            <h1>Helenes Spill</h1>
            <ScoreBox score={score} totalWords={totalWords} playerName={playerName} setPlayerName={setPlayerName} />
            <GameBoard onGameEnd={handleGameEnd} />
        </div>
    );
}

function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 86400000).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
}

function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
}

export default App;
