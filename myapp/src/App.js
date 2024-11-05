import React, { useState, useEffect } from 'react';
import GameBoard from './components/GameBoard';
import ScoreBox from './components/ScoreBox';
import './index.css';

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

// Function to retrieve score history from cookies
const getScoreHistory = () => {
    const history = getCookie("scoreHistory");
    return history ? JSON.parse(history) : [];
};

function App() {
    const [score, setScore] = useState(0);
    const [totalWords, setTotalWords] = useState(0);
    const [playerName, setPlayerName] = useState(getCookie("playerName") || "");
    const [gameWords, setGameWords] = useState([]); // Stores the words for the current game session
    const [gameLetters, setGameLetters] = useState([]); // Stores the letters for the current game session
    const [loading, setLoading] = useState(true);
    const [scoreHistory, setScoreHistory] = useState(getScoreHistory() || []); // Load score history from cookies

    const updateScoreHistory = (finalScore) => {
        const today = new Date().toLocaleDateString("no-NO"); // Format the date
        const newEntry = `${today} ${finalScore} av ${totalWords}`;
        let updatedHistory = [...scoreHistory, newEntry];

        // Limit the history to the last 10 entries
        if (updatedHistory.length > 10) {
            updatedHistory = updatedHistory.slice(updatedHistory.length - 10);
        }
        console.log('Score History:', scoreHistory);

        setScoreHistory(updatedHistory);
        setCookie("scoreHistory", JSON.stringify(updatedHistory), 1); // Save updated history to cookies
    };

    const handleGameEnd = (finalScore) => {
        setScore(finalScore);
        setCookie("lastScore", finalScore, 1);
        updateScoreHistory(finalScore); // Update score history
    };

    useEffect(() => {
        async function fetchGameData() {
            try {
                const response = await fetch(`${process.env.PUBLIC_URL}/dailyLetters.json`);
                if (!response.ok) throw new Error("Failed to load puzzle data.");

                const { letters, words } = await response.json();
                setGameLetters(letters); // Set letters for the game
                setGameWords(words);     // Set words for the game
                setTotalWords(words.length); // Set totalWords based on the words array
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
                scoreHistory={scoreHistory} // Pass score history to ScoreBox
            />
            <GameBoard onGameEnd={handleGameEnd} possibleWords={gameWords} letters={gameLetters} />
        </div>
    );
}

export default App;
