import React, { useState, useEffect } from 'react';
import GameBoard from './components/GameBoard';
import ScoreBox from './components/ScoreBox';
import './index.css';

function App() {
    const [score, setScore] = useState(0);
    const [totalWords, setTotalWords] = useState(0);
    const [playerName, setPlayerName] = useState(getCookie("playerName") || "");
    const [gameWords, setGameWords] = useState([]); // Stores only the words for the current game session
    const [loading, setLoading] = useState(true);

    const handleGameEnd = (finalScore) => {
        setScore(finalScore);
        setCookie("lastScore", finalScore, 1);
    };
    
    useEffect(() => {
        async function fetchGameData() {
            try {
                const response = await fetch(`${process.env.PUBLIC_URL}/dailyLetters.json`);
                if (!response.ok) throw new Error("Failed to load puzzle data.");

                const { letters, words } = await response.json();
                setGameWords(words); // Set only the words filtered for the game
                setTotalWords(words.length); // Set totalWords based on the filtered words
                setLoading(false);
            } catch (error) {
                console.error("Error fetching daily puzzle data:", error);
            }
        }

        fetchGameData();
    }, []);

    if (loading) return <div>Loading puzzle...</div>;

    return (
        <div className="App">
            <h1>Helenes Spill</h1>
            <ScoreBox 
                score={score} 
                totalWords={totalWords} 
                playerName={playerName} 
                setPlayerName={setPlayerName} 
            />
            <GameBoard onGameEnd={handleGameEnd} possibleWords={gameWords} />
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
