import React, { useState, useEffect } from 'react';
import GameBoard from './components/GameBoard';
import ScoreBox from './components/ScoreBox';
import './App.css';

// Function to get a cookie by name
const getCookie = (name) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : null;
};

// Function to set a cookie
const setCookie = (name, value, days) => {
    const expires = new Date(Date.now() + days * 86400000).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
};

// Function to clear all cookies
const clearCookies = () => {
    document.cookie.split(";").forEach((cookie) => {
        const cookieName = cookie.split("=")[0].trim();
        document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    });
    alert("All cookies cleared.");
};

// Function to retrieve score history from cookies
const getScoreHistory = () => {
    const history = getCookie("scoreHistory");
    return history ? JSON.parse(history) : [];
};

function App() {
    const [score, setScore] = useState(0);
    const [totalWords, setTotalWords] = useState(0);
    const [playerName, setPlayerName] = useState(getCookie("playerName") || ""); // Get player name from cookies
    const [gameWords, setGameWords] = useState([]);
    const [gameLetters, setGameLetters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [scoreHistory, setScoreHistory] = useState(getScoreHistory() || []); // Load score history from cookies
    const [hasPlayedToday, setHasPlayedToday] = useState(false); // Track if the player has played today
    const [isGameFinished, setIsGameFinished] = useState(false); // Track if the game is finished (like if "Give Up" was pressed)

    // Check if player has already played today
    useEffect(() => {
        const today = new Date().toLocaleDateString("no-NO"); // Get today's date
        const todayScore = scoreHistory.find(entry => entry.date.trim() === today);

        if (todayScore) {
            setHasPlayedToday(true); // Set flag to true if player has played today
        }
    }, [scoreHistory]);

    const updateScoreHistory = (finalScore) => {
        const today = new Date().toLocaleDateString("no-NO"); // Get today's date
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

    // Function to update the player name and save it in cookies
    const handlePlayerNameChange = (newName) => {
        setPlayerName(newName);
        setCookie("playerName", newName, 30); // Save name to cookies for 30 days
    };

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
                console.error("Error fetching daily puzzle data:", error);
            }
        }

        fetchGameData();
    }, []);

    if (loading) return <div>Loading puzzle...</div>;

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
                    isGameFinished={isGameFinished || hasPlayedToday} // Pass game finished state
                />
                <GameBoard
                    onGameEnd={handleGameEnd}
                    possibleWords={gameWords}
                    letters={gameLetters}
                    isGameFinished={isGameFinished || hasPlayedToday} // Disable game interaction if finished or played today
                />
            </div>
            <button onClick={clearCookies}>Clear Cookies</button> {/* Clear Cookies button */}
        </div>
    );
}

export default App;
