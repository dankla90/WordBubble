import React, { useState, useEffect } from 'react';
import GameBoard from './components/GameBoard';
import ScoreBox from './components/ScoreBox';
import WordDisplay from './components/WordDisplay';
import './App.css';

// Utility functions for cookies
const getCookie = (name) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
};

const setCookie = (name, value, days) => {
    const expires = new Date(Date.now() + days * 86400000).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
};

const clearCookies = () => {
    document.cookie.split(";").forEach((cookie) => {
        const cookieName = cookie.split("=")[0].trim();
        document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    });
    alert("All cookies cleared.");
};

const getScoreHistory = () => {
    const history = getCookie("scoreHistory");
    return history ? JSON.parse(history) : [];
};

function App() {
    const [score, setScore] = useState(0);
    const [totalWords, setTotalWords] = useState(0);
    const [playerName, setPlayerName] = useState(getCookie("playerName") || "");
    const [gameWords, setGameWords] = useState([]);
    const [gameLetters, setGameLetters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [guessedWords, setGuessedWords] = useState([]);
    const [scoreHistory, setScoreHistory] = useState(getScoreHistory() || []);
    const [hasPlayedToday, setHasPlayedToday] = useState(false);
    const [isGameFinished, setIsGameFinished] = useState(false);
    const [isScoreBoxMinimized, setScoreBoxMinimized] = useState(true); // Default to maximized


    // Check if player has played today
    useEffect(() => {
        const today = new Date().toLocaleDateString("no-NO");
        const todayScore = scoreHistory.find(entry => entry.date.trim() === today);
        if (todayScore) {
            setHasPlayedToday(true);
        }
    }, [scoreHistory]);

    const updateScoreHistory = (finalScore) => {
        const today = new Date().toLocaleDateString("no-NO");
        const newEntry = {
            playerName: playerName,
            date: today,
            score: finalScore,
            total: totalWords
        };

        let updatedHistory = [...scoreHistory, newEntry];
        if (updatedHistory.length > 10) {
            updatedHistory = updatedHistory.slice(updatedHistory.length - 10);
        }

        setScoreHistory(updatedHistory);
        setCookie("scoreHistory", JSON.stringify(updatedHistory), 1);
    };

    const handleGameEnd = (finalScore) => {
        setScore(finalScore);
        setCookie("lastScore", finalScore, 1);
        updateScoreHistory(finalScore);
        setIsGameFinished(true);
    };

    const handlePlayerNameChange = (newName) => {
        setPlayerName(newName);
        setCookie("playerName", newName, 30);
    };

    const handleAddGuessedWord = (word) => {
        setGuessedWords([...guessedWords, word]);
    };

    // Fetch game data
    useEffect(() => {
        async function fetchGameData() {
            try {
                const response = await fetch(`${process.env.PUBLIC_URL}/dailyLetters.json`);
                if (!response.ok) throw new Error("Failed to load puzzle data.");
                const { letters, words } = await response.json();
                setGameLetters(letters);
                setGameWords(words);
                setTotalWords(words.length);
                setLoading(false);
            } catch (error) {
                console.error("Feil med henting av data", error);
            }
        }

        fetchGameData();
    }, []);

    if (loading) return <div>Loading puzzle...</div>;

    // Toggle score box state (minimized or expanded)
    const toggleScoreBox = () => {
        setScoreBoxMinimized(!isScoreBoxMinimized);
    };

    return (
        <div className="App">
            <h1>Helenes Spill</h1>
            <div className="game-container">
                <ScoreBox
                    score={score}
                    totalWords={totalWords}
                    playerName={playerName}
                    setPlayerName={handlePlayerNameChange}
                    scoreHistory={scoreHistory}
                    isGameFinished={isGameFinished || hasPlayedToday}
                    isMinimized={isScoreBoxMinimized} // Pass the minimized state
                    toggleScoreBox={toggleScoreBox} // Pass the toggle function
                />
                <GameBoard
                    onGameEnd={handleGameEnd}
                    possibleWords={gameWords}
                    letters={gameLetters}
                    isGameFinished={isGameFinished || hasPlayedToday}
                    guessedWords={guessedWords}
                    addGuessedWord={handleAddGuessedWord}
                />
                <WordDisplay
                    guessedWords={guessedWords}
                    possibleWords={gameWords}
                    hasGivenUp={isGameFinished}
                    hasPlayedToday={hasPlayedToday}
                />
            </div>
            <button onClick={clearCookies}>Slett Cookies</button>
        </div>
    );
}

export default App;
